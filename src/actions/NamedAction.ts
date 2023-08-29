import { RealpathAction, RealpathActionOptions } from "./RealpathAction";

export type NamedActionOptions = RealpathActionOptions;

export interface NamedAction<O extends NamedActionOptions = NamedActionOptions>
  extends RealpathAction<O> {
  getName: () => string;
}
