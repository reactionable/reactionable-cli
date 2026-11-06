import type { Container } from "inversify";
import AddHosting from "./add-hosting/AddHosting.js";
import { bindHostingAdapters } from "./add-hosting/container.js";
import AddRouter from "./add-router/AddRouter.js";
import { bindRouterAdapters } from "./add-router/container.js";
import AddUIFramework from "./add-ui-framework/AddUIFramework.js";
import { bindUIFrameworkAdapters } from "./add-ui-framework/container.js";
import AddVersioning from "./add-versioning/AddVersioning.js";
import { bindVersioningAdapters } from "./add-versioning/container.js";
import CreateApp from "./create-app/CreateApp.js";
import { bindCreateAppAdapters } from "./create-app/container.js";
import CreateComponent from "./create-component/CreateComponent.js";
import CreateCrudComponent from "./create-component/CreateCrudComponent.js";
import GenerateReadme from "./generate-readme/GenerateReadme.js";

export const ActionIdentifier = Symbol("Action");

// Service identifiers to avoid circular dependencies in ESM
export const CreateAppIdentifier = Symbol.for("CreateApp");
export const AddUIFrameworkIdentifier = Symbol.for("AddUIFramework");
export const AddHostingIdentifier = Symbol.for("AddHosting");
export const AddRouterIdentifier = Symbol.for("AddRouter");

export function bindActions(container: Container): void {
	// Available root actions - bind in dependency order
	// Use alias bindings so class, symbol, and CLI identifiers resolve the same singleton instance.
	container.bind<AddUIFramework>(AddUIFramework).toSelf();
	container
		.bind<AddUIFramework>(AddUIFrameworkIdentifier)
		.toService(AddUIFramework);

	container.bind<AddRouter>(AddRouter).toSelf();
	container.bind<AddRouter>(AddRouterIdentifier).toService(AddRouter);

	container.bind<AddVersioning>(AddVersioning).toSelf();

	container.bind<AddHosting>(AddHosting).toSelf();
	container.bind<AddHosting>(AddHostingIdentifier).toService(AddHosting);

	container.bind<CreateApp>(CreateApp).toSelf();
	container.bind<CreateApp>(CreateAppIdentifier).toService(CreateApp);
	container.bind<CreateApp>(ActionIdentifier).toService(CreateApp);

	container.bind<CreateComponent>(CreateComponent).toSelf();
	container.bind<CreateComponent>(ActionIdentifier).toService(CreateComponent);
	container.bind<CreateCrudComponent>(CreateCrudComponent).toSelf();
	container
		.bind<CreateCrudComponent>(ActionIdentifier)
		.toService(CreateCrudComponent);
	container.bind<GenerateReadme>(GenerateReadme).toSelf();
	container.bind<GenerateReadme>(ActionIdentifier).toService(GenerateReadme);

	// Bind adapters
	bindCreateAppAdapters(container);
	bindHostingAdapters(container);
	bindRouterAdapters(container);
	bindUIFrameworkAdapters(container);
	bindVersioningAdapters(container);
}
