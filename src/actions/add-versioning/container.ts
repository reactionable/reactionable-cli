import 'reflect-metadata';
import { Container } from 'inversify';
import Git from './adapters/github/Github';
import { IVersioningAdapter } from './IVersioningAdapter';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IVersioningAdapter>('Adapter').to(Git);

export default container;