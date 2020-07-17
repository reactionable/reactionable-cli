import 'reflect-metadata';
import { Container } from 'inversify';

import Github from './adapters/github/Github';
import { IVersioningAdapter } from './IVersioningAdapter';

export const AdapterKey = 'VersioningAdapter';

export function bindVersioningAdapters(container: Container) {
  container.bind<IVersioningAdapter>(AdapterKey).to(Github);
  container.bind<Github>(Github).toSelf();
}
