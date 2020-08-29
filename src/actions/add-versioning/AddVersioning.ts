import { injectable } from 'inversify';

import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { AdapterKey } from './container';
import { IVersioningAdapter } from './IVersioningAdapter';

@injectable()
export default class AddVersioning extends AbstractActionWithAdapters<IVersioningAdapter> {
  protected name = 'Versioning';
  protected adapterKey = AdapterKey;
}
