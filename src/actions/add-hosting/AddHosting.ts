import { injectable } from 'inversify'
import container from './container';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { AbstractAdapterWithPackage } from '../AbstractAdapterWithPackage';

@injectable()
export default class AddHosting extends AbstractActionWithAdapters<AbstractAdapterWithPackage> {
    protected name = 'Hosting';
    protected container = container;
}