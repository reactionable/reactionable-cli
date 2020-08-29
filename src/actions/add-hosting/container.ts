import 'reflect-metadata';

import { Container } from 'inversify';

import Amplify from './adapters/amplify/Amplify';
import { IHostingAdapter } from './adapters/IHostingAdapter';
import Netlify from './adapters/netlify/Netlify';

export const AdapterKey = 'HostingAdapter';

export function bindHostingAdapters(container: Container) {
  container.bind<IHostingAdapter>(AdapterKey).to(Amplify);
  container.bind<IHostingAdapter>(AdapterKey).to(Netlify);
}
