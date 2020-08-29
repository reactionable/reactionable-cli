import { IAdapter } from '../../IAdapter';
import { IOptions } from '../../IRunnable';

export interface IHostingAdapter<O extends IOptions = {}> extends IAdapter<O> {}
