import 'reflect-metadata';
import { Container } from 'inversify';
import Amplify from './adapters/amplify/Amplify';
import Netlify from './adapters/netlify/Netlify';
import { IAdapter } from '../IAdapter';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IAdapter>('Adapter').to(Amplify);
container.bind<IAdapter>('Adapter').to(Netlify);

export default container;