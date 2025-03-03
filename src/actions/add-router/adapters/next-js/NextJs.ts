import { injectFromBase } from "inversify";
import { AbstractAdapterWithPackageAction } from "../../../AbstractAdapterWithPackageAction";
import { RouterAdapter } from "../RouterAdapter";

@injectFromBase()
export default class NextJs extends AbstractAdapterWithPackageAction implements RouterAdapter {
  protected name = "NextJS (NextJs routing integration)";
  protected adapterPackageName = "@reactionable/nextjs";
}
