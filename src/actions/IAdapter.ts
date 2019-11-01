import { IRealpathRunnable } from './IRealpathRunnable';
import { IOptions } from './IRunnable';

export interface IAdapter<O extends IOptions = {}> extends IRealpathRunnable<O> {
    getName: () => string;
}