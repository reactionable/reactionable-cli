import { injectable } from 'inversify';

import { RealpathAction, RealpathActionOptions } from './RealpathAction';

export type AdapterActionOptions = RealpathActionOptions;

@injectable()
export abstract class AbstractAdapterAction<O extends AdapterActionOptions = AdapterActionOptions>
  implements RealpathAction<O> {
  protected abstract name: string;

  getName(): string {
    return this.name;
  }

  abstract async isEnabled(realpath: string): Promise<boolean>;
  abstract async run(options: AdapterActionOptions): Promise<void>;
}
