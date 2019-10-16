import 'reflect-metadata';
import { Container } from 'inversify';
import { IVersioningAction } from './versionings/IVersioningAction';
import Git from './versionings/git/Git';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IVersioningAction>('Versioning').to(Git);

export default container;