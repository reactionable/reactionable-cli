import { IAdapter } from '../IAdapter';
import { IOptions } from '../IRunnable';
import { Result } from 'parse-github-url';

export interface IVersioningAdapter<O extends IOptions = {}>
  extends IAdapter<O> {
  validateGitRemote(input: string): string | Result;
}
