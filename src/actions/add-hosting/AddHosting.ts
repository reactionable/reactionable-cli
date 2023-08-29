import { injectable } from "inversify";

import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters";
import { HostingAdapter } from "./adapters/HostingAdapter";
import { AdapterKey } from "./container";

@injectable()
export default class AddHosting extends AbstractCommitableActionWithAdapters<HostingAdapter> {
  protected name = "Hosting";
  protected adapterKey = AdapterKey;
}
