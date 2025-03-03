import { injectFromBase } from "inversify";
import { AbstractAdapterWithPackageAction } from "../../../AbstractAdapterWithPackageAction";
import { UIFrameworkAdapter } from "../UIFrameworkAdapter";

@injectFromBase()
export default class UIMaterial
  extends AbstractAdapterWithPackageAction
  implements UIFrameworkAdapter
{
  protected name = "UI Material (Material-UI integration)";
  protected adapterPackageName = "@reactionable/ui-material";
}
