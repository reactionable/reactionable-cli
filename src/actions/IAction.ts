import { IRunnable } from './IRunnable';

export interface IAction<O = any|undefined> extends IRunnable<O> {
    getName: () => string;
}