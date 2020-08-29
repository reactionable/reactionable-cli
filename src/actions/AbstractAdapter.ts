import { injectable } from 'inversify';

import { IRealpathRunnable } from './IRealpathRunnable';
import { IOptions } from './IRunnable';

@injectable()
export abstract class AbstractAdapter<O extends IOptions = {}> implements IRealpathRunnable<O> {
  protected abstract name: string;

  getName(): string {
    return this.name;
  }

  abstract async isEnabled(realpath: string): Promise<boolean>;
  abstract async run(options): Promise<void>;
}
