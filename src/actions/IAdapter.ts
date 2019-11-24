import { IRealpathRunnable } from './IRealpathRunnable';
import { IOptions } from './IRunnable';

export interface IAdapter<O extends IOptions = {}> extends IRealpathRunnable<O> {
    isEnabled(realpath: string) : Promise<boolean>;
    getName: () => string;
}