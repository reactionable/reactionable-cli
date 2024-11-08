import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { UIFrameworkAdapter } from "./adapters/UIFrameworkAdapter";
import { AdapterKey } from "./container";

export default class AddUIFramework extends AbstractActionWithAdapters<UIFrameworkAdapter> {
  protected name = "UI Framework";
  protected adapterKey = AdapterKey;
}
