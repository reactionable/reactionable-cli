import { injectable, inject } from 'inversify';
import { prompt } from 'inquirer';
import { resolve } from 'path';

import { AbstractAdapter } from '../../../AbstractAdapter';
import { FileFactory } from '../../../../services/file/FileFactory';
import { TomlFile } from '../../../../services/file/TomlFile';
import { ConsoleService } from '../../../../services/ConsoleService';
import { info, error } from 'console';
import { FileService } from '../../../../services/file/FileService';
import { PackageManagerService } from '../../../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../../../services/TemplateService';
import { CliService } from '../../../../services/CliService';
import { GitService } from '../../../../services/git/GitService';
import { IHostingAdapter } from '../IHostingAdapter';
import { StringUtils } from '../../../../services/StringUtils';

@injectable()
export default class Netlify
  extends AbstractAdapter
  implements IHostingAdapter {
  protected name = 'Netlify (https://docs.netlify.com)';

  constructor(
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(FileService) private readonly fileService: FileService,
    @inject(TemplateService) private readonly templateService: TemplateService,
    @inject(CliService) private readonly cliService: CliService,
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(PackageManagerService)
    private readonly packageManagerService: PackageManagerService
  ) {
    super();
  }

  async isEnabled(realpath: string): Promise<boolean> {
    return this.fileService.fileExistsSync(resolve(realpath, 'netlify.toml'));
  }

  async run({ realpath }) {
    // Add netlify default configuration files
    info('Configure Netlify...');

    if (!this.cliService.getGlobalCmd('netlify')) {
      return error(
        'Unable to configure Netlify, please install globally "@netlify/cli" or "npx"'
      );
    }

    const { projectName } = await prompt([
      {
        type: 'input',
        name: 'projectName',
        default: await this.packageManagerService.getPackageName(
          realpath,
          'hyphenize'
        ),
        message: 'Enter a name for the netlify application',
        transformer: (value) => StringUtils.hyphenize(value),
      },
    ]);

    const netlifyFilePath = resolve(realpath, 'netlify.toml');

    await this.fileFactory
      .fromFile<TomlFile>(netlifyFilePath)
      .appendContent(
        await this.templateService.renderTemplateFile(
          'add-hosting/netlify/netlify.toml',
          {
            nodeVersion: this.cliService.getNodeVersion(),
            projectBranch: await this.gitService.getGitCurrentBranch(
              realpath,
              'master'
            ),
            projectPath: realpath,
            projectName,
          }
        )
      )
      .saveFile();

    // Configure netlify

    // Check if netlify is configured
    let netlifyConfig: { name: string } | undefined;
    let gitRemoteUrl = await this.gitService.getGitRemoteOriginUrl(
      realpath,
      false
    );
    if (gitRemoteUrl) {
      gitRemoteUrl = gitRemoteUrl.replace(/\.git$/, '');

      const sitesListData = await this.execNetlifyCmd(
        [
          'api',
          'listSites',
          '--data',
          JSON.stringify(JSON.stringify({ filter: 'all' })),
        ],
        realpath,
        true
      );
      const sitesList = JSON.parse(sitesListData);
      for (const site of sitesList) {
        let siteRepoUrl = site?.build_settings?.repo_url;
        if (!siteRepoUrl) {
          continue;
        }
        siteRepoUrl = siteRepoUrl.replace(/\.git$/, '');
        if (siteRepoUrl === gitRemoteUrl) {
          netlifyConfig = site;
          break;
        }
      }
    }

    if (netlifyConfig) {
      this.consoleService.success(
        `Netlify is already configured for site \"${netlifyConfig.name}\"`
      );
      return;
    }

    await this.execNetlifyCmd(
      ['sites:create', '-n', projectName, '--with-ci'],
      realpath
    );

    this.consoleService.success(
      `Netlify has been configured in \"${realpath}\"`
    );
  }

  private execNetlifyCmd(args: string[], realpath: string, silent?: boolean) {
    const netlifyCmd = this.cliService.getGlobalCmd('netlify');
    if (!netlifyCmd) {
      throw new Error(
        'Unable to configure Netlify, please install globally "@netlify/cli" or "npx"'
      );
    }
    return this.cliService.execCmd([netlifyCmd, ...args], realpath, silent);
  }
}
