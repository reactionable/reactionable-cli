import { prompt } from 'inquirer';
import { injectable, inject } from 'inversify';
import { Result } from 'parse-github-url';

import { PackageManagerService } from '../../../services/package-manager/PackageManagerService';
import { GitService } from '../../../services/git/GitService';
import { AbstractAdapter } from '../../AbstractAdapter';
import { IVersioningAdapter } from '../IVersioningAdapter';
import { ConsoleService } from '../../../services/ConsoleService';
import { TemplateService } from '../../../services/TemplateService';
import { ConventionalCommitsService } from '../../../services/git/ConventionalCommitsService';

@injectable()
export default abstract class AbstractVersioning extends AbstractAdapter
  implements IVersioningAdapter {
  constructor(
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(ConventionalCommitsService)
    private readonly conventionalCommitsService: ConventionalCommitsService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(GitService) protected readonly gitService: GitService
  ) {
    super();
  }

  async run({ realpath }) {
    await this.gitService.initializeGit(realpath);

    const gitRemoteOriginUrl = await this.gitService.getGitRemoteOriginUrl(
      realpath,
      false
    );

    if (!gitRemoteOriginUrl) {
      this.consoleService.info('Define git remote url...');

      const { remoteOriginUrl } = await prompt([
        {
          type: 'input',
          name: 'remoteOriginUrl',
          message: 'Remote origin url (https://gitxxx.com/username/new_repo)',
          validate: (input) => {
            const result = this.validateGitRemote(input);
            return typeof result === 'string' ? result : true;
          },
        },
      ]);

      await this.gitService.execGitCmd(
        ['remote', 'add', 'origin', remoteOriginUrl],
        realpath
      );
      await this.gitService.execGitCmd(['push', '--all'], realpath);
      this.consoleService.info(
        'Git remote url as been set to "' + remoteOriginUrl + '"'
      );
    }

    await this.packageManagerService.updatePackageJson(realpath, {
      repository: {
        type: 'git',
        url: 'git+' + gitRemoteOriginUrl,
      },
    });

    if (!this.conventionalCommitsService.hasConventionalCommits(realpath)) {
      const { conventionalCommits } = await prompt([
        {
          type: 'confirm',
          name: 'conventionalCommits',
          message:
            'Do you want to use Conventional Commits (https://www.conventionalcommits.org)',
        },
      ]);

      if (conventionalCommits) {
        await this.conventionalCommitsService.initializeConventionalCommits(
          realpath
        );
      }
    }

    return this.gitService.commitFiles(realpath, 'Initial commit', 'feat');
  }

  validateGitRemote(input: string): string | Result {
    return (
      this.gitService.parseGitRemoteUrl(input) ||
      `Could not parse Git remote from given url "${input}"`
    );
  }
}
