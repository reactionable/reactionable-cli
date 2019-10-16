import { IRunnable } from './IRunnable';

export interface IRealpathRunnable<O = any|undefined> extends IRunnable<O & { realpath: string }> {}

