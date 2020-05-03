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
import { StringUtils } from '../../../../services/StringUtils';
import { JsonFile } from '../../../../services/file/JsonFile';
import { FileService } from '../../../../services/file/FileService';

type ProjectConfig = {
  projectName: string;
};

type BackendConfig = {
  auth?: {
    [key: string]: {
      service: string;
      providerPlugin: string;
    };
  };
  api?: {
    [key: string]: {
      service: string;
      providerPlugin: string;
    };
  };
  hosting: {
    amplifyhosting: {
      service: string;
      providerPlugin: string;
      type: string;
    };
  };
};

@injectable()
export default class Amplify extends AbstractAdapterWithPackage
  implements IHostingAdapter {
  protected name = 'Amplify';
  protected adapterPackageName = '@reactionable/amplify';

  constructor(
    @inject(FileService) private readonly fileService: FileService,
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

    // Add amplify default configuration files
    this.consoleService.info('Prepare Amplify configuration...');
    const projectBranch = await this.gitService.getGitCurrentBranch(
      realpath,
      'master'
    );

    let projectName = this.getProjectName(realpath);
    if (!projectName) {
      const response = await prompt([
        {
          type: 'input',
          name: 'projectName',
          default: await this.packageManagerService.getPackageName(
            realpath,
            'camelize'
          ),
          message: 'Enter a name for the amplify project',
          transformer: (value) => StringUtils.camelize(value),
        },
      ]);
      projectName = response.projectName;
    }

    await this.templateService.renderTemplateTree(
      realpath,
      'add-hosting/amplify',
      {
        amplify: {
          '.config': ['project-config.json'],
          ...(!this.getBackendConfig(realpath) && {
            backend: ['backend-config.json'],
          }),
        },
      },
      {
        projectBranch: JSON.stringify(projectBranch),
        projectPath: JSON.stringify(realpath),
        projectName: JSON.stringify(projectName),
        packageManager: this.packageManagerService.getPackageManagerCmd(
          realpath
        ),
      }
    );

    // Configure amplify
    if (!this.getAmplifyCmd()) {
      return this.consoleService.error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }

    this.consoleService.info('Configure Amplify...');

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

    await this.addAuth(realpath);
    await this.addApi(realpath);
    await this.addHosting(realpath);

    await this.fileFactory
      .fromFile<TypescriptFile>(resolve(realpath, 'src/App.tsx'))
      .setImports(
        [
          {
            packageName: '@reactionable/amplify',
            modules: { IIdentityContextProviderProps: '' },
          },
          { packageName: 'aws-amplify', modules: { Amplify: 'default' } },
          { packageName: './aws-exports', modules: { awsconfig: 'default' } },
        ],
        [
          {
            packageName: '@reactionable/core',
            modules: { IIdentityContextProviderProps: '' },
          },
        ]
      )
      .appendContent('Amplify.configure(awsconfig);', "import './App.scss';")
      .saveFile();

    await this.fileFactory
      .fromFile<TypescriptFile>(resolve(realpath, 'src/i18n/i18n.ts'))
      .setImports(
        [
          {
            packageName: '@reactionable/amplify',
            modules: { initializeI18n: '' },
          },
        ],
        [
          {
            packageName: '@reactionable/core',
            modules: { initializeI18n: '' },
          },
        ]
      )
      .saveFile();

    await this.packageManagerService.installPackages(
      realpath,
      ['concurrently'],
      false,
      true
    );
    await this.packageManagerService.updatePackageJson(realpath, {
      scripts: {
        start: 'concurrently "amplify mock" "yarn react-scripts start"',
      },
    });

    this.consoleService.success(`Amplify has been configured in "${realpath}"`);
  }

  private getAmplifyCmd(): string | null {
    const localAmplifyCmd = this.cliService.getCmd('amplify');
    if (localAmplifyCmd) {
      return localAmplifyCmd;
    }

    return this.cliService.getGlobalCmd('amplify-app');
  }

  private async execAmplifyCmd(
    args: string[],
    realpath: string,
    silent?: boolean
  ) {
    const cmd = this.getAmplifyCmd();
    if (!cmd) {
      throw new Error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }
    if (cmd === 'amplify') {
      await this.cliService.upgradeGlobalPackage('@aws-amplify/cli');
    }
    return this.cliService.execCmd([cmd, ...args], realpath, silent);
  }

  private getProjectName(realpath: string): string | undefined {
    const projectConfigFilePath = resolve(
      realpath,
      'amplify/.config/project-config.json'
    );

    if (!this.fileService.fileExistsSync(projectConfigFilePath)) {
      return undefined;
    }

    return this.fileFactory
      .fromFile<JsonFile>(projectConfigFilePath)
      .getData<ProjectConfig>()?.projectName;
  }

  private getBackendConfig(realpath: string): BackendConfig | undefined {
    const backendConfigFilePath = resolve(
      realpath,
      'amplify/backend/backend-config.json'
    );
    if (!this.fileService.fileExistsSync(backendConfigFilePath)) {
      return undefined;
    }

    return this.fileFactory
      .fromFile<JsonFile>(backendConfigFilePath)
      .getData<BackendConfig>();
  }

  private async addAuth(realpath: string) {
    const backendConfig = this.getBackendConfig(realpath);
    let isAuthAdded = !!backendConfig?.auth;

    if (!isAuthAdded) {
      const { addAuth } = await prompt([
        {
          type: 'confirm',
          name: 'addAuth',
          message:
            'Do you want to add Authentication (https://docs.amplify.aws/cli/auth/overview)?',
        },
      ]);

      if (!addAuth) {
        return;
      }

      this.consoleService.info('Add Amplify authentication...');
      await this.execAmplifyCmd(['add', 'auth'], realpath);
    }

    await this.fileFactory
      .fromFile<TypescriptFile>(resolve(realpath, 'src/App.tsx'))
      .setImports([
        {
          packageName: '@reactionable/amplify',
          modules: {
            useIdentityContextProviderProps: '',
            IIdentityContextProviderProps: '',
          },
        },
      ])
      .replaceContent(
        /identity: undefined,.*$/m,
        'identity: useIdentityContextProviderProps(),'
      )
      .saveFile();

    await this.fileFactory
      .fromFile(resolve(realpath, 'src/index.tsx'))
      .appendContent(
        "import '@aws-amplify/ui/dist/style.css';",
        "import './index.scss';"
      )
      .saveFile();
  }

  private async addApi(realpath: string) {
    const backendConfig = this.getBackendConfig(realpath);
    let isApiAdded = !!backendConfig?.api;

    if (isApiAdded) {
      return;
    }

    const { addApi } = await prompt([
      {
        type: 'confirm',
        name: 'addApi',
        message: 'Do you want to add an API?',
      },
    ]);

    if (!addApi) {
      return;
    }

    this.consoleService.info('Add Amplify Api...');
    await this.execAmplifyCmd(['add', 'api'], realpath);
  }

  private async addHosting(realpath: string) {
    const backendConfig = this.getBackendConfig(realpath);
    let isHostingAdded = !!backendConfig?.hosting?.amplifyhosting;

    if (isHostingAdded) {
      return;
    }

    this.consoleService.info('Add Amplify hosting...');
    await this.execAmplifyCmd(['hosting', 'add'], realpath);
  }
}
