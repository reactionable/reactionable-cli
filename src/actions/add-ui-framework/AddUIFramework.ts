import { injectable } from 'inversify'
import container from './container';
import { AbstractActionWithAdapters } from '../AbstractActionWithAdapters';
import { AbstractAdapterWithPackage } from '../AbstractAdapterWithPackage';

@injectable()
export default class AddUIFramework extends AbstractActionWithAdapters<AbstractAdapterWithPackage> {
    protected name = 'UI Framework';
    protected container = container;
}