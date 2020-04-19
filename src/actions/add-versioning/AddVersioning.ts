import { injectable } from 'inversify';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { IVersioningAdapter } from './IVersioningAdapter';
import { AdapterKey } from './container';

@injectable()
export default class AddVersioning extends AbstractActionWithAdapters<
  IVersioningAdapter
> {
  protected name = 'Versioning';
  protected adapterKey = AdapterKey;
}
