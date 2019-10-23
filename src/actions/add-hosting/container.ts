import 'reflect-metadata';
import { Container } from 'inversify';
import { IHostingAction } from './hostings/IHostingAction';
import Amplify from './hostings/amplify/Amplify';
import Netlify from './hostings/netlify/Netlify';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IHostingAction>('Hosting').to(Amplify);
container.bind<IHostingAction>('Hosting').to(Netlify);

export default container;