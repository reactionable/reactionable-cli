import { injectFromBase } from "inversify";
import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters.js";
import { AdapterIdentifier } from "./container.js";
import type { VersioningAdapter } from "./VersioningAdapter.js";

@injectFromBase()
export default class AddVersioning extends AbstractActionWithAdapters<VersioningAdapter> {
	protected name = "Versioning";
	protected adapterIdentifier = AdapterIdentifier;
}
