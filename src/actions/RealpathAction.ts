import { RunnableAction, RunnableOptions } from "./RunnableAction";

export interface RealpathActionOptions extends RunnableOptions {
  realpath: string;
}
export type RealpathAction<O extends RealpathActionOptions = RealpathActionOptions> =
  RunnableAction<O>;
