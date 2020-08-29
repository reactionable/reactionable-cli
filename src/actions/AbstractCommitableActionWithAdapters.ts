import { inject, injectable } from 'inversify';

import { ConsoleService } from '../services/ConsoleService';
import { GitService } from '../services/git/GitService';
import { AbstractActionWithAdapters } from './AbstractActionWithAdapters';
import AddVersioning from './add-versioning/AddVersioning';
import { IAdapter } from './IAdapter';
import { IOptions } from './IRunnable';

@injectable()
export abstract class AbstractCommitableActionWithAdapters<
  A extends IAdapter,
  O extends IOptions = {}
> extends AbstractActionWithAdapters<A, O> {
  constructor(
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) consoleService: ConsoleService
  ) {
    super(consoleService);
  }

  async run(options) {
    await super.run(options);

    const adapter = await this.detectAdapter(options.realpath);
    if (!adapter) {
      return;
    }

    if (!(await this.gitService.isAGitRepository(options.realpath))) {
      return;
    }

    await this.gitService.commitFiles(
      options.realpath,
      `adding ${this.getName()} "${adapter.getName()}"`,
      'feat'
    );
  }
}
