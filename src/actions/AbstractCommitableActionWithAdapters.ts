import { injectable, inject } from 'inversify';
import { IOptions } from './IRunnable';
import { IAdapter } from './IAdapter';
import { AbstractActionWithAdapters } from './AbstractActionWithAdapters';
import AddVersioning from './add-versioning/AddVersioning';
import { ConsoleService } from '../services/ConsoleService';
import { GitService } from '../services/git/GitService';

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
      `Adding ${this.getName()} "${adapter.getName()}"`,
      'feat'
    );
  }
}
