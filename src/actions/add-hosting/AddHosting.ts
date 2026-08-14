import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters";
import type { HostingAdapter } from "./adapters/HostingAdapter";
import { AdapterIdentifier } from "./container";

export default class AddHosting extends AbstractCommitableActionWithAdapters<HostingAdapter> {
	protected name = "Hosting";
	protected adapterIdentifier = AdapterIdentifier;
}
