import { inject, injectable } from "inversify";
import { Result } from "parse-github-url";
import prompts from "prompts";

import { ConsoleService } from "../../../services/ConsoleService";
import { GitService } from "../../../services/git/GitService";
import { PackageManagerService } from "../../../services/package-manager/PackageManagerService";
import { AbstractAdapterAction } from "../../AbstractAdapterAction";
import { VersioningAdapter, VersioningAdapterOptions } from "../VersioningAdapter";

@injectable()
export default abstract class AbstractVersioning
  extends AbstractAdapterAction
  implements VersioningAdapter
{
  constructor(
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(GitService) protected readonly gitService: GitService
  ) {
    super();
  }

  async isEnabled(realpath: string): Promise<boolean> {
    return this.gitService.isAGitRepository(realpath);
  }

  async run({ realpath }: VersioningAdapterOptions): Promise<void> {
    await this.gitService.initializeGit(realpath);

    const gitRemoteOriginUrl = await this.gitService.getGitRemoteOriginUrl(realpath, false);

    if (!gitRemoteOriginUrl) {
      this.consoleService.info("Define git remote url...");

      const { remoteOriginUrl } = await prompts([
        {
          type: "text",
          name: "remoteOriginUrl",
          message: "Remote origin url (https://gitxxx.com/username/new_repo)",
          validate: (input) => {
            const result = this.validateGitRemote(input);
            return typeof result === "string" ? result : true;
          },
        },
      ]);

      await this.gitService.execGitCmd(["remote", "add", "origin", remoteOriginUrl], realpath);
      this.consoleService.info(`Git remote url as been set to "${remoteOriginUrl}"`);
    }

    await this.packageManagerService.updatePackageJson(realpath, {
      repository: {
        type: "git",
        url: `git+${gitRemoteOriginUrl}`,
      },
    });

    return this.gitService.commitFiles(realpath, "initial commit", "feat");
  }

  validateGitRemote(input: string): string | Result {
    return (
      this.gitService.parseGitRemoteUrl(input) ||
      `Could not parse Git remote from given url "${input}"`
    );
  }
}
