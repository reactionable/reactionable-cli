import 'reflect-metadata';
import { Container } from 'inversify';

import ReactBootstrap from './adapters/ReactBootstrap';
import { IUIFrameworkAdapter } from './adapters/IUIFrameworkAdapter';

export const AdapterKey = 'UIFrameworkAdapter';

export function bindUIFrameworkAdapters(container: Container) {
  container.bind<IUIFrameworkAdapter>(AdapterKey).to(ReactBootstrap);
}
