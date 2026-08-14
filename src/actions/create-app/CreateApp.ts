import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters";
import type { CreateAppAdapter } from "./adapters/CreateAppAdapter";
import { AdapterIdentifier } from "./container";

export default class CreateApp extends AbstractCommitableActionWithAdapters<CreateAppAdapter> {
	protected name = "Create a new application";
	protected adapterIdentifier = AdapterIdentifier;
}
