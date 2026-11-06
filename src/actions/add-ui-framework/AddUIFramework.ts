import { injectFromBase } from "inversify";
import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters.js";
import type { UIFrameworkAdapter } from "./adapters/UIFrameworkAdapter.js";
import { AdapterIdentifier } from "./container.js";

@injectFromBase()
export default class AddUIFramework extends AbstractActionWithAdapters<UIFrameworkAdapter> {
	protected name = "UI Framework";
	protected adapterIdentifier = AdapterIdentifier;
}
