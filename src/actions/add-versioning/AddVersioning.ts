import { injectable } from 'inversify'
import container from './container';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { IAdapter } from '../IAdapter';

@injectable()
export default class AddVersioning extends AbstractActionWithAdapters<IAdapter> {
    protected name = 'Versioning';
    protected container = container;
}