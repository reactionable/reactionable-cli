import { injectable } from 'inversify';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { IUIFrameworkAdapter } from './adapters/IUIFrameworkAdapter';
import { AdapterKey } from './container';

@injectable()
export default class AddUIFramework extends AbstractActionWithAdapters<
  IUIFrameworkAdapter
> {
  protected name = 'UI Framework';
  protected adapterKey = AdapterKey;
}
