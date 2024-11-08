import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { AdapterKey } from "./container";
import { VersioningAdapter } from "./VersioningAdapter";

export default class AddVersioning extends AbstractActionWithAdapters<VersioningAdapter> {
  protected name = "Versioning";
  protected adapterKey = AdapterKey;
}
