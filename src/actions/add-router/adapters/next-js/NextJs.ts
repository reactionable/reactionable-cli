import { injectFromBase } from "inversify";
import { AbstractAdapterWithPackageAction } from "../../../AbstractAdapterWithPackageAction.js";
import type { RouterAdapter } from "../RouterAdapter.js";

@injectFromBase()
export default class NextJs
	extends AbstractAdapterWithPackageAction
	implements RouterAdapter
{
	protected name = "NextJS (NextJs routing integration)";
	protected adapterPackageName = "@reactionable/nextjs";
}
