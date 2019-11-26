
import { injectable, inject } from 'inversify';
import { IOptions } from './IRunnable';
import { IAdapter } from './IAdapter';
import { AbstractActionWithAdapters } from './AbstractActionWithAdapters';
import AddVersioning from './add-versioning/AddVersioning';

@injectable()
export abstract class AbstractCommitableActionWithAdapters<A extends IAdapter, O extends IOptions = {}> extends AbstractActionWithAdapters<A, O> {

    constructor(
        @inject(AddVersioning) private addVersioning: AddVersioning,
    ) {
        super();
    }

    async run(options) {
        await super.run(options);

        const adapter = await this.detectAdapter(options.realpath);
        if (!adapter) {
            return;
        }

        const versioningAdapter = await this.addVersioning.detectAdapter(options.realpath);
        if (!versioningAdapter) {
            return;
        }

        await versioningAdapter.commitFiles(
            options.realpath,
            `Adding ${this.getName()} "${adapter.getName()}"`,
            'feat'
        );
    }
}