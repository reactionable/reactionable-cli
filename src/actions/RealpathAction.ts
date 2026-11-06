import type { RunnableAction, RunnableOptions } from "./RunnableAction.js";

export interface RealpathActionOptions extends RunnableOptions {
	realpath: string;
}
export type RealpathAction<
	O extends RealpathActionOptions = RealpathActionOptions,
> = RunnableAction<O>;
