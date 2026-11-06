import { injectFromBase } from "inversify";
import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters.js";
import type { RouterAdapter } from "./adapters/RouterAdapter.js";
import { AdapterIdentifier } from "./container.js";

@injectFromBase()
export default class AddRouter extends AbstractActionWithAdapters<RouterAdapter> {
	protected name = "Router";
	protected adapterIdentifier = AdapterIdentifier;
}
