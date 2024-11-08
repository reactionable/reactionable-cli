import { RealpathAction, RealpathActionOptions } from "./RealpathAction";

export type AdapterActionOptions = RealpathActionOptions;

export abstract class AbstractAdapterAction<O extends AdapterActionOptions = AdapterActionOptions>
  implements RealpathAction<O>
{
  protected abstract name: string;

  getName(): string {
    return this.name;
  }

  abstract isEnabled(realpath: string): Promise<boolean>;
  abstract run(options: AdapterActionOptions): Promise<void>;
}
