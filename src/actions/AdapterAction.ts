import { RealpathAction, RealpathActionOptions } from './RealpathAction';

export type AdapterActionOptions = RealpathActionOptions;

export interface AdapterAction<O extends AdapterActionOptions = AdapterActionOptions>
  extends RealpathAction<O> {
  isEnabled(realpath: string): Promise<boolean>;
  getName: () => string;
}
