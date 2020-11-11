import 'reflect-metadata';

import { Container } from 'inversify';

import Amplify from './adapters/amplify/Amplify';
import { HostingAdapter } from './adapters/HostingAdapter';
import Netlify from './adapters/netlify/Netlify';

export const AdapterKey = 'HostingAdapter';

export function bindHostingAdapters(container: Container): void {
  container.bind<HostingAdapter>(AdapterKey).to(Amplify);
  container.bind<HostingAdapter>(AdapterKey).to(Netlify);
}
