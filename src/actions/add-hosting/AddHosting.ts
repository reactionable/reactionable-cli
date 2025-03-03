import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters";
import { HostingAdapter } from "./adapters/HostingAdapter";
import { AdapterKey } from "./container";

export default class AddHosting extends AbstractCommitableActionWithAdapters<HostingAdapter> {
  protected name = "Hosting";
  protected adapterIdentifier = AdapterKey;
}
