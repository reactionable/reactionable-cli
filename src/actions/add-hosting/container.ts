import 'reflect-metadata';
import { Container } from 'inversify';

import Amplify from './adapters/amplify/Amplify';
import Netlify from './adapters/netlify/Netlify';
import { IHostingAdapter } from './adapters/IHostingAdapter';

export const AdapterKey = 'HostingAdapter';

export function bindHostingAdapters(container: Container) {
  container.bind<IHostingAdapter>(AdapterKey).to(Amplify);
  container.bind<IHostingAdapter>(AdapterKey).to(Netlify);
}
