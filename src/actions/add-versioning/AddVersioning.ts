import { injectable } from "inversify";

import { AbstractActionWithAdapters } from "../AbstractActionWithAdapters";
import { AdapterKey } from "./container";
import { VersioningAdapter } from "./VersioningAdapter";

@injectable()
export default class AddVersioning extends AbstractActionWithAdapters<VersioningAdapter> {
  protected name = "Versioning";
  protected adapterKey = AdapterKey;
}
