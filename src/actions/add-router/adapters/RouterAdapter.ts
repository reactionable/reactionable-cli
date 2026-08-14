import { injectFromBase } from "inversify";
import {
	AbstractAdapterWithPackageAction,
	type AdapterWithPackageActionOptions,
} from "../../AbstractAdapterWithPackageAction";

export type RouterAdapter<
	O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions,
> = AbstractAdapterWithPackageAction<O>;

@injectFromBase()
export abstract class AbstractRouterAdapter
	extends AbstractAdapterWithPackageAction
	implements RouterAdapter {}
