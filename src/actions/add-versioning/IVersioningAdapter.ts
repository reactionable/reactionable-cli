import { IAdapter } from '../IAdapter';
import { IOptions } from '../IRunnable';

export interface IVersioningAdapter<O extends IOptions = {}> extends IAdapter<O> {
    commitFiles(realpath: string, commitMessage: string, commitMessageType: string): Promise<void>;
}