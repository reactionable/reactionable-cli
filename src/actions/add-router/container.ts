import "reflect-metadata";

import { Container } from "inversify";

import NextJs from "./adapters/next-js/NextJs";
import { RouterAdapter } from "./adapters/RouterAdapter";
import RouterDom from "./adapters/router-dom/RouterDom";

export const AdapterKey = "RouterAdapter";

export function bindRouterAdapters(container: Container): void {
  container.bind<RouterAdapter>(AdapterKey).to(NextJs);
  container.bind<RouterAdapter>(AdapterKey).to(RouterDom);
}
