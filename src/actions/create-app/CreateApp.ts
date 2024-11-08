import { AbstractCommitableActionWithAdapters } from "../AbstractCommitableActionWithAdapters";
import { CreateAppAdapter } from "./adapters/CreateAppAdapter";
import { AdapterKey } from "./container";

export default class CreateApp extends AbstractCommitableActionWithAdapters<CreateAppAdapter> {
  protected name = "Create a new application";
  protected adapterKey = AdapterKey;
}
