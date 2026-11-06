import { injectFromBase } from "inversify";
import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters.js";
import type { CreateAppAdapter } from "./adapters/CreateAppAdapter.js";
import { AdapterIdentifier } from "./container.js";

@injectFromBase()
export default class CreateApp extends AbstractCommitableActionWithAdapters<CreateAppAdapter> {
	protected name = "Create a new application";
	protected adapterIdentifier = AdapterIdentifier;
}
