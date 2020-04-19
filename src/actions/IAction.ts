import {
  IRealpathRunnable,
  IRealpathRunnableOptions,
} from './IRealpathRunnable';
import { IOptions } from './IRunnable';

export interface IAction<O extends IOptions = any>
  extends IRealpathRunnable<O & IRealpathRunnableOptions> {
  getName: () => string;
}
