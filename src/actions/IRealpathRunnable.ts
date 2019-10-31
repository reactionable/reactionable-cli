import { IRunnable } from './IRunnable';

export interface IRealpathRunnable<O = any|{}> extends IRunnable<O & { realpath: string }> {}

