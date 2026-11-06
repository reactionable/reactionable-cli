import type { RealpathAction, RealpathActionOptions } from "./RealpathAction.js";

export type NamedActionOptions = RealpathActionOptions;

export interface NamedAction<O extends NamedActionOptions = NamedActionOptions>
	extends RealpathAction<O> {
	getName: () => string;
}
