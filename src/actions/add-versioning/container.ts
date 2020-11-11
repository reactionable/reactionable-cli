import 'reflect-metadata';

import { Container } from 'inversify';

import Github from './adapters/github/Github';
import { VersioningAdapter } from './VersioningAdapter';

export const AdapterKey = 'VersioningAdapter';

export function bindVersioningAdapters(container: Container): void {
  container.bind<VersioningAdapter>(AdapterKey).to(Github);
  container.bind<Github>(Github).toSelf();
}
