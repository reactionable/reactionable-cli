import 'reflect-metadata';
import { Container } from 'inversify';
import ReactBootstrap from './adapters/ReactBootstrap';
import { IAdapter } from '../IAdapter';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IAdapter>('Adapter').to(ReactBootstrap);

export default container;