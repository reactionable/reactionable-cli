import { injectable, inject } from 'inversify';
import { prompt } from 'inquirer';
import { resolve } from 'path';

import { FileFactory } from '../../../../services/file/FileFactory';
import { TypescriptFile } from '../../../../services/file/TypescriptFile';
import { AbstractAdapterWithPackage } from '../../../AbstractAdapterWithPackage';
import { TemplateService } from '../../../../services/TemplateService';
import { CliService } from '../../../../services/CliService';
import { GitService } from '../../../../services/git/GitService';
import { ConsoleService } from '../../../../services/ConsoleService';
import { PackageManagerService } from '../../../../services/package-manager/PackageManagerService';
import { IHostingAdapter } from '../IHostingAdapter';

@injectable()
export default class Amplify extends AbstractAdapterWithPackage
  implements IHostingAdapter {
  protected name = 'Amplify';
  protected packageName = '@reactionable/amplify';

  constructor(
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(TemplateService) private readonly templateService: TemplateService,
    @inject(CliService) private readonly cliService: CliService,
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService
  ) {
    super(packageManagerService);
  }

  async run({ realpath }) {
    await super.run({ realpath });

    // Add amplify config in App component
    this.consoleService.info('Add amplify config in App component...');
    const appFile = resolve(realpath, 'src/App.tsx');
    await this.fileFactory
      .fromFile<TypescriptFile>(appFile)
      .setImports(
        [
          {
            packageName: '@reactionable/amplify',
            modules: {
              useIdentityContextProviderProps: '',
              IIdentityContextProviderProps: '',
            },
          },
          {
            packageName: 'aws-amplify',
            modules: {
              Amplify: 'default',
            },
          },
          {
            packageName: './aws-exports',
            modules: {
              awsconfig: 'default',
            },
          },
        ],
        [
          {
            packageName: '@reactionable/core',
            modules: {
              IIdentityContextProviderProps: '',
            },
          },
        ]
      )
      .appendContent('Amplify.configure(awsconfig);', "import './App.scss';")
      .saveFile();

    // Add amplify default configuration files
    this.consoleService.info('Configure Amplify...');
    const projectBranch = await this.gitService.getGitCurrentBranch(
      realpath,
      'master'
    );
    const projectName = this.packageManagerService.getPackageJsonData(
      realpath,
      'name'
    );

    await this.templateService.renderTemplateTree(
      realpath,
      'add-hosting/amplify',
      {
        amplify: {
          '.config': ['project-config.json'],
          backend: ['backend-config.json'],
        },
      },
      {
        projectBranch: JSON.stringify(projectBranch),
        projectPath: JSON.stringify(realpath),
        projectName: JSON.stringify(projectName),
      }
    );

    // Configure amplify
    if (!this.getAmplifyCmd()) {
      return this.consoleService.error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }

    // Amplify config
    const amplifyConfig = {
      envName: projectBranch,
    };
    const awsCloudFormation = {
      useProfile: true,
      profileName: 'default',
    };
    await this.execAmplifyCmd(
      [
        'init',
        '--amplify',
        JSON.stringify(JSON.stringify(amplifyConfig)),
        '--awscloudformation',
        JSON.stringify(JSON.stringify(awsCloudFormation)),
      ],
      realpath
    );
    await this.execAmplifyCmd(['hosting', 'add'], realpath);

    const { addAuth } = await prompt([
      {
        type: 'confirm',
        name: 'addAuth',
        message:
          'Do you want to add Authentication (https://aws-amplify.github.io/docs/js/authentication)',
      },
    ]);

    if (addAuth) {
      await this.execAmplifyCmd(['add', 'auth'], realpath);
      await this.execAmplifyCmd(['push'], realpath);

      await this.fileFactory
        .fromFile(appFile)
        .replaceContent(
          /identity: undefined,.*$/m,
          'identity: useIdentityContextProviderProps(),'
        )
        .saveFile();
    }

    const { addApi } = await prompt([
      {
        type: 'confirm',
        name: 'addApi',
        message:
          'Do you want to add an API (https://aws-amplify.github.io/docs/js/api)',
      },
    ]);

    if (addApi) {
      await this.execAmplifyCmd(['add', 'api'], realpath);
      await this.execAmplifyCmd(['push'], realpath);
    }

    this.consoleService.success(`Amplify has been configured in "${realpath}"`);
  }

  protected getAmplifyCmd(): string | null {
    const localAmplifyCmd = this.cliService.getCmd('amplify');
    if (localAmplifyCmd) {
      return localAmplifyCmd;
    }

    return this.cliService.getGlobalCmd('amplify-app');
  }

  private execAmplifyCmd(args: string[], realpath: string, silent?: boolean) {
    const cmd = this.getAmplifyCmd();
    if (!cmd) {
      throw new Error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }
    return this.cliService.execCmd([cmd, ...args], realpath, silent);
  }
}
