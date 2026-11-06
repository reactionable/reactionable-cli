import "reflect-metadata";

import type { Container } from "inversify";
import type { CreateAppAdapter } from "./adapters/CreateAppAdapter.js";
import CreateNextApp from "./adapters/create-next-app/CreateNextApp.js";
import CreateReactApp from "./adapters/create-react-app/CreateReactApp.js";

export const AdapterIdentifier = Symbol("CreateAppAdapter");

export function bindCreateAppAdapters(container: Container): void {
	container.bind<CreateReactApp>(CreateReactApp).toSelf();
	container.bind<CreateAppAdapter>(AdapterIdentifier).toService(CreateReactApp);
	container.bind<CreateNextApp>(CreateNextApp).toSelf();
	container.bind<CreateAppAdapter>(AdapterIdentifier).toService(CreateNextApp);
}
