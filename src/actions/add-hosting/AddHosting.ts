import { injectable } from 'inversify'
import container from './container';
import { AbstractAdapterWithPackage } from '../AbstractAdapterWithPackage';
import { AbstractCommitableActionWithAdapters } from '../AbstractCommitableActionWithAdapters';
import { AbstractAdapter } from '../AbstractAdapter';

@injectable()
export default class AddHosting extends AbstractCommitableActionWithAdapters<AbstractAdapterWithPackage|AbstractAdapter> {
    protected name = 'Hosting';
    protected container = container;
}