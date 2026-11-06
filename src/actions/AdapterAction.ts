import type { RealpathAction, RealpathActionOptions } from "./RealpathAction.js";

export type AdapterActionOptions = RealpathActionOptions;

export interface AdapterAction<
	O extends AdapterActionOptions = AdapterActionOptions,
> extends RealpathAction<O> {
	isEnabled(realpath: string): Promise<boolean>;
	getName: () => string;
}
