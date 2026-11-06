import { injectFromBase } from "inversify";
import { AbstractRouterAdapter } from "../RouterAdapter.js";

@injectFromBase()
export default class RouterDom extends AbstractRouterAdapter {
	protected name = "RouterDom (React Router Dom integration)";
	protected adapterPackageName = "@reactionable/router-dom";
}
