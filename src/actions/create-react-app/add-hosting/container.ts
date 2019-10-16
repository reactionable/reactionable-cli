import 'reflect-metadata';
import { Container } from 'inversify';
import { IHostingAction } from './hostings/IHostingAction';
import Amplify from './hostings/amplify/Amplify';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IHostingAction>('Hosting').to(Amplify);

export default container;