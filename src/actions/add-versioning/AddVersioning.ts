import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { AdapterIdentifier } from "./container";
import { VersioningAdapter } from "./VersioningAdapter";

export default class AddVersioning extends AbstractActionWithAdapters<VersioningAdapter> {
  protected name = "Versioning";
  protected adapterIdentifier = AdapterIdentifier;
}
