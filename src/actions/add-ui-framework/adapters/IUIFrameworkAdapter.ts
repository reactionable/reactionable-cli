import { AbstractAdapterWithPackage } from '../../AbstractAdapterWithPackage';
import { IOptions } from '../../IRunnable';

export interface IUIFrameworkAdapter<O extends IOptions = {}>
  extends AbstractAdapterWithPackage<O> {}
