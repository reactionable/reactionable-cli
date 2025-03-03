import "reflect-metadata";

import { Container } from "inversify";

import CreateNextApp from "./adapters/create-next-app/CreateNextApp";
import CreateReactApp from "./adapters/create-react-app/CreateReactApp";
import { CreateAppAdapter } from "./adapters/CreateAppAdapter";

export const AdapterIdentifier = Symbol("CreateAppAdapter");

export function bindCreateAppAdapters(container: Container): void {
  container.bind<CreateAppAdapter>(AdapterIdentifier).to(CreateReactApp);
  container.bind<CreateReactApp>(CreateReactApp).toSelf();
  container.bind<CreateAppAdapter>(AdapterIdentifier).to(CreateNextApp);
  container.bind<CreateNextApp>(CreateNextApp).toSelf();
}
