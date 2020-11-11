import 'reflect-metadata';

import { Container } from 'inversify';

import ReactBootstrap from './adapters/ReactBootstrap';
import { UIFrameworkAdapter } from './adapters/UIFrameworkAdapter';

export const AdapterKey = 'UIFrameworkAdapter';

export function bindUIFrameworkAdapters(container: Container): void {
  container.bind<UIFrameworkAdapter>(AdapterKey).to(ReactBootstrap);
}
