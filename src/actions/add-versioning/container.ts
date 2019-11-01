import 'reflect-metadata';
import { Container } from 'inversify';
import { IVersioningAction } from './versionings/IVersioningAction';
import Git from './versionings/github/Github';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IVersioningAction>('Versioning').to(Git);

export default container;