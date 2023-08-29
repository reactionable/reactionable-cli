import { Result } from "parse-github-url";

import { AdapterAction, AdapterActionOptions } from "../AdapterAction";

export type VersioningAdapterOptions = AdapterActionOptions;
export interface VersioningAdapter<O extends VersioningAdapterOptions = VersioningAdapterOptions>
  extends AdapterAction<O> {
  validateGitRemote(input: string): string | Result;
}
