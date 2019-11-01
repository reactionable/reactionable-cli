import 'reflect-metadata';
import { Container } from 'inversify';
import Git from './adapters/github/Github';
import { IAdapter } from '../IAdapter';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IAdapter>('Adapter').to(Git);

export default container;