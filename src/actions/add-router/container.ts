import "reflect-metadata";

import type { Container } from "inversify";

import NextJs from "./adapters/next-js/NextJs.js";
import type { RouterAdapter } from "./adapters/RouterAdapter.js";
import RouterDom from "./adapters/router-dom/RouterDom.js";

export const AdapterIdentifier = Symbol.for("RouterAdapter");

export function bindRouterAdapters(container: Container): void {
	container.bind<RouterAdapter>(AdapterIdentifier).to(NextJs);
	container.bind<RouterAdapter>(AdapterIdentifier).to(RouterDom);
}
