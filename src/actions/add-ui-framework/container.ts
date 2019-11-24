import 'reflect-metadata';
import { Container } from 'inversify';
import ReactBootstrap from './adapters/ReactBootstrap';
import { AbstractAdapterWithPackage } from '../AbstractAdapterWithPackage';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<AbstractAdapterWithPackage>('Adapter').to(ReactBootstrap);

export default container;