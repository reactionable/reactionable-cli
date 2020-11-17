import { injectable } from 'inversify';

import { AbstractCommitableActionWithAdapters } from '../AbstractCommitableActionWithAdapters';
import { CreateAppAdapter } from './adapters/CreateAppAdapter';
import { AdapterKey } from './container';

@injectable()
export default class CreateApp extends AbstractCommitableActionWithAdapters<CreateAppAdapter> {
  protected name = 'CreateApp';
  protected adapterKey = AdapterKey;
}
