import { Container } from "inversify";
import AddHosting from "./add-hosting/AddHosting";
import { bindHostingAdapters } from "./add-hosting/container";
import AddRouter from "./add-router/AddRouter";
import { bindRouterAdapters } from "./add-router/container";
import AddUIFramework from "./add-ui-framework/AddUIFramework";
import { bindUIFrameworkAdapters } from "./add-ui-framework/container";
import AddVersioning from "./add-versioning/AddVersioning";
import { bindVersioningAdapters } from "./add-versioning/container";
import { bindCreateAppAdapters } from "./create-app/container";
import CreateApp from "./create-app/CreateApp";
import CreateComponent from "./create-component/CreateComponent";
import CreateCrudComponent from "./create-component/CreateCrudComponent";
import GenerateReadme from "./generate-readme/GenerateReadme";

export const ActionIdentifier = Symbol("Action");

export function bindActions(container: Container): void {
  // Available root actions
  container.bind<CreateApp>(ActionIdentifier).to(CreateApp);
  container.bind<CreateApp>(CreateApp).toSelf();
  container.bind<CreateComponent>(ActionIdentifier).to(CreateComponent);
  container.bind<CreateComponent>(CreateComponent).toSelf();
  container.bind<CreateCrudComponent>(ActionIdentifier).to(CreateCrudComponent);
  container.bind<CreateCrudComponent>(CreateCrudComponent).toSelf();
  container.bind<GenerateReadme>(ActionIdentifier).to(GenerateReadme);
  container.bind<GenerateReadme>(GenerateReadme).toSelf();

  // Sub actions
  container.bind<AddUIFramework>(AddUIFramework).toSelf();
  container.bind<AddRouter>(AddRouter).toSelf();
  container.bind<AddVersioning>(AddVersioning).toSelf();
  container.bind<AddHosting>(AddHosting).toSelf();

  // Bind adapters
  bindCreateAppAdapters(container);
  bindHostingAdapters(container);
  bindRouterAdapters(container);
  bindUIFrameworkAdapters(container);
  bindVersioningAdapters(container);
}
