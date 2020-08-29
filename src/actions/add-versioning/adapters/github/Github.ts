import { inject, injectable } from 'inversify';
import { Result } from 'parse-github-url';

import { ConsoleService } from '../../../../services/ConsoleService';
import { ConventionalCommitsService } from '../../../../services/git/ConventionalCommitsService';
import { GitService } from '../../../../services/git/GitService';
import { PackageManagerService } from '../../../../services/package-manager/PackageManagerService';
import AbstractVersioning from '../AbstractVersioning';

@injectable()
export default class Github extends AbstractVersioning {
  protected name = 'Github';

  constructor(
    @inject(ConsoleService) consoleService: ConsoleService,
    @inject(ConventionalCommitsService)
    conventionalCommitsService: ConventionalCommitsService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(GitService) protected readonly gitService: GitService
  ) {
    super(consoleService, conventionalCommitsService, packageManagerService, gitService);
  }

  async isEnabled(realpath: string): Promise<boolean> {
    const isEnabled = await super.isEnabled(realpath);
    if (!isEnabled) {
      return isEnabled;
    }

    const parsedGitRemote = await this.gitService.getGitRemoteOriginUrl(realpath, false);
    return !!(parsedGitRemote && this.validateGitRemote(parsedGitRemote));
  }

  async run({ realpath }) {
    await super.run({ realpath });

    const parsedGitRemote = await this.gitService.getGitRemoteOriginUrl(realpath, true);
    if (!parsedGitRemote) {
      throw new Error('Unable to parse git remote origin url');
    }

    const repositoryUrl = `https://${parsedGitRemote.host}/${parsedGitRemote.repo}`;
    await this.packageManagerService.updatePackageJson(realpath, {
      author: {
        name: parsedGitRemote.owner || undefined,
      },
      bugs: {
        url: repositoryUrl + '/issues',
      },
    });
  }

  validateGitRemote(input: string): string | Result {
    const result = super.validateGitRemote(input);
    if (typeof result === 'string') {
      return result;
    }

    if (!result.host) {
      return `Could not parse Git remote host from given url "${input}"`;
    }

    if (result.host !== 'github.com') {
      return `Git remote url "${input}" is not a Github url`;
    }

    return result;
  }
}
