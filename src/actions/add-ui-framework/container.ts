import 'reflect-metadata';
import { Container } from 'inversify';
import ReactBootstrap from './ui-frameworks/ReactBootstrap';
import { IUIFrameworkAction } from './ui-frameworks/IUIFrameworkAction';

let container = new Container({ defaultScope: 'Singleton' });

container.bind<IUIFrameworkAction>('UIFramework').to(ReactBootstrap);

export default container;