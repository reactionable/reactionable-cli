import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from '../../AbstractAdapterWithPackageAction';

export type UIFrameworkAdapter<
  O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions
> = AbstractAdapterWithPackageAction<O>;
