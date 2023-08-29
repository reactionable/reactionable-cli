import { inject, injectable } from "inversify";

import { ConsoleService } from "../services/ConsoleService";
import { GitService } from "../services/git/GitService";
import {
  AbstractActionWithAdapters,
  ActionWithAdaptersOptions,
} from "./AbstractActionWithAdapters";
import { AdapterAction } from "./AdapterAction";
import { CliService } from "../services/CliService";

export type CommitableActionWithAdaptersOptions = ActionWithAdaptersOptions;

@injectable()
export abstract class AbstractCommitableActionWithAdapters<
  A extends AdapterAction,
  O extends CommitableActionWithAdaptersOptions = CommitableActionWithAdaptersOptions,
> extends AbstractActionWithAdapters<A, O> {
  constructor(
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) consoleService: ConsoleService,
    @inject(CliService) cliService: CliService
  ) {
    super(consoleService, cliService);
  }

  async run(options: CommitableActionWithAdaptersOptions): Promise<void> {
    await super.run(options);

    const adapter = await this.detectAdapter(options.realpath);
    if (!adapter) {
      return;
    }

    const isAGitRepository = await this.gitService.isAGitRepository(options.realpath);
    if (!isAGitRepository) {
      return;
    }

    await this.gitService.commitFiles(
      options.realpath,
      `adding ${this.getName()} "${adapter.getName()}"`,
      "feat"
    );
  }
}
