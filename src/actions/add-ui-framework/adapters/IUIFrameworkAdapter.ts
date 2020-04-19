import { IOptions } from '../../IRunnable';
import { AbstractAdapterWithPackage } from '../../AbstractAdapterWithPackage';

export interface IUIFrameworkAdapter<O extends IOptions = {}>
  extends AbstractAdapterWithPackage<O> {}
