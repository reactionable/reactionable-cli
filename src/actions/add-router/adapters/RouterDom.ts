import { injectable } from "inversify";

import { AbstractRouterAdapter } from "./RouterAdapter";

@injectable()
export default class RouterDom extends AbstractRouterAdapter {
  protected name = "RouterDom (React Router Dom integration)";
  protected adapterPackageName = "@reactionable/router-dom";
}
