import { injectFromBase } from "inversify";
import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from "../../AbstractAdapterWithPackageAction";

export type RouterAdapter<
  O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions,
> = AbstractAdapterWithPackageAction<O>;

@injectFromBase()
export abstract class AbstractRouterAdapter
  extends AbstractAdapterWithPackageAction
  implements RouterAdapter {}
