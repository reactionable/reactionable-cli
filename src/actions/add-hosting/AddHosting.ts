import { injectFromBase } from "inversify";
import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters.js";
import type { HostingAdapter } from "./adapters/HostingAdapter.js";
import { AdapterIdentifier } from "./container.js";

@injectFromBase()
export default class AddHosting extends AbstractCommitableActionWithAdapters<HostingAdapter> {
	protected name = "Hosting";
	protected adapterIdentifier = AdapterIdentifier;
}
