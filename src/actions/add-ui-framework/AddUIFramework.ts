import { injectFromBase } from "inversify";
import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { UIFrameworkAdapter } from "./adapters/UIFrameworkAdapter";
import { AdapterIdentifier } from "./container";

@injectFromBase()
export default class AddUIFramework extends AbstractActionWithAdapters<UIFrameworkAdapter> {
  protected name = "UI Framework";
  protected adapterIdentifier = AdapterIdentifier;
}
