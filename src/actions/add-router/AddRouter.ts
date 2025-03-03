import { injectFromBase } from "inversify";
import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { RouterAdapter } from "./adapters/RouterAdapter";
import { AdapterKey } from "./container";

@injectFromBase()
export default class AddRouter extends AbstractActionWithAdapters<RouterAdapter> {
  protected name = "Router";
  protected adapterIdentifier = AdapterKey;
}
