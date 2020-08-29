import 'reflect-metadata';

import { Container } from 'inversify';

import { IUIFrameworkAdapter } from './adapters/IUIFrameworkAdapter';
import ReactBootstrap from './adapters/ReactBootstrap';

export const AdapterKey = 'UIFrameworkAdapter';

export function bindUIFrameworkAdapters(container: Container) {
  container.bind<IUIFrameworkAdapter>(AdapterKey).to(ReactBootstrap);
}
