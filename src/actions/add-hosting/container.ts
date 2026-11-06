import "reflect-metadata";

import type { Container } from "inversify";

import Amplify from "./adapters/amplify/Amplify.js";
import type { HostingAdapter } from "./adapters/HostingAdapter.js";
import Netlify from "./adapters/netlify/Netlify.js";

export const AdapterIdentifier = Symbol.for("HostingAdapter");

export function bindHostingAdapters(container: Container): void {
	container.bind<HostingAdapter>(AdapterIdentifier).to(Amplify);
	container.bind<HostingAdapter>(AdapterIdentifier).to(Netlify);
}
