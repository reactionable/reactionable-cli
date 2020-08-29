import { Result } from 'parse-github-url';

import { IAdapter } from '../IAdapter';
import { IOptions } from '../IRunnable';

export interface IVersioningAdapter<O extends IOptions = {}> extends IAdapter<O> {
  validateGitRemote(input: string): string | Result;
}
