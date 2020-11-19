import { injectable } from 'inversify';

import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { RouterAdapter } from './adapters/RouterAdapter';
import { AdapterKey } from './container';

@injectable()
export default class AddRouter extends AbstractActionWithAdapters<RouterAdapter> {
  protected name = 'Router';
  protected adapterKey = AdapterKey;
}
