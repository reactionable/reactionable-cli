import { Container } from "inversify";
import CreateApp from "./create-app/CreateApp";
import AddUIFramework from "./add-ui-framework/AddUIFramework";
import AddHosting from "./add-hosting/AddHosting";
import AddRouter from "./add-router/AddRouter";
import { bindHostingAdapters } from "./add-hosting/container";
import { bindRouterAdapters } from "./add-router/container";
import { bindUIFrameworkAdapters } from "./add-ui-framework/container";
import AddVersioning from "./add-versioning/AddVersioning";
import { bindVersioningAdapters } from "./add-versioning/container";
import { bindCreateAppAdapters } from "./create-app/container";
import CreateComponent from "./create-component/CreateComponent";
import CreateCrudComponent from "./create-component/CreateCrudComponent";
import GenerateReadme from "./generate-readme/GenerateReadme";

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
  container.bind<AddUIFramework>(AddUIFrameworkIdentifier).toService(AddUIFramework);

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
  container.bind<CreateCrudComponent>(ActionIdentifier).toService(CreateCrudComponent);
  container.bind<GenerateReadme>(GenerateReadme).toSelf();
  container.bind<GenerateReadme>(ActionIdentifier).toService(GenerateReadme);

  // Bind adapters
  bindCreateAppAdapters(container);
  bindHostingAdapters(container);
  bindRouterAdapters(container);
  bindUIFrameworkAdapters(container);
  bindVersioningAdapters(container);
}
