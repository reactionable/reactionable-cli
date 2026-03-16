import "reflect-metadata";

import { Container } from "inversify";

import Amplify from "./adapters/amplify/Amplify";
import { HostingAdapter } from "./adapters/HostingAdapter";
import Netlify from "./adapters/netlify/Netlify";

export const AdapterIdentifier = Symbol.for("HostingAdapter");

export function bindHostingAdapters(container: Container): void {
  container.bind<HostingAdapter>(AdapterIdentifier).to(Amplify);
  container.bind<HostingAdapter>(AdapterIdentifier).to(Netlify);
}
