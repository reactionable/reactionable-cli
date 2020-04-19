import { IOptions } from '../../IRunnable';
import { IAdapter } from '../../IAdapter';

export interface IHostingAdapter<O extends IOptions = {}> extends IAdapter<O> {}
