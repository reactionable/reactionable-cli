import { injectable } from 'inversify';

import { AbstractCommitableActionWithAdapters } from '../AbstractCommitableActionWithAdapters';
import { IHostingAdapter } from './adapters/IHostingAdapter';
import { AdapterKey } from './container';

@injectable()
export default class AddHosting extends AbstractCommitableActionWithAdapters<IHostingAdapter> {
  protected name = 'Hosting';
  protected adapterKey = AdapterKey;
}
