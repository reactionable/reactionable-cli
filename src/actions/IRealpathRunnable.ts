import { IRunnable, IOptions } from './IRunnable';

export interface IRealpathRunnableOptions extends IOptions { 
    realpath: string 
};
export interface IRealpathRunnable<O extends IOptions = any> extends IRunnable<IRealpathRunnableOptions & O> {}

