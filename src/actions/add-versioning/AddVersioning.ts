import { injectable } from 'inversify'
import container from './container';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { IVersioningAdapter } from './IVersioningAdapter';

@injectable()
export default class AddVersioning extends AbstractActionWithAdapters<IVersioningAdapter> {
    protected name = 'Versioning';
    protected container = container;
}