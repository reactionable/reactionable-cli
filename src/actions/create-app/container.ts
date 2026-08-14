import "reflect-metadata";

import type { Container } from "inversify";
import type { CreateAppAdapter } from "./adapters/CreateAppAdapter";
import CreateNextApp from "./adapters/create-next-app/CreateNextApp";
import CreateReactApp from "./adapters/create-react-app/CreateReactApp";

export const AdapterIdentifier = Symbol("CreateAppAdapter");

export function bindCreateAppAdapters(container: Container): void {
	container.bind<CreateReactApp>(CreateReactApp).toSelf();
	container.bind<CreateAppAdapter>(AdapterIdentifier).toService(CreateReactApp);
	container.bind<CreateNextApp>(CreateNextApp).toSelf();
	container.bind<CreateAppAdapter>(AdapterIdentifier).toService(CreateNextApp);
}
