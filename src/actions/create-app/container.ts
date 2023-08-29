import "reflect-metadata";

import { Container } from "inversify";

import CreateNextApp from "./adapters/create-next-app/CreateNextApp";
import CreateReactApp from "./adapters/create-react-app/CreateReactApp";
import { CreateAppAdapter } from "./adapters/CreateAppAdapter";

export const AdapterKey = "CreateAppAdapter";

export function bindCreateAppAdapters(container: Container): void {
  container.bind<CreateAppAdapter>(AdapterKey).to(CreateReactApp);
  container.bind<CreateReactApp>(CreateReactApp).toSelf();
  container.bind<CreateAppAdapter>(AdapterKey).to(CreateNextApp);
  container.bind<CreateNextApp>(CreateNextApp).toSelf();
}
