import "reflect-metadata";

import { Container } from "inversify";

import AddHosting from "./actions/add-hosting/AddHosting";
import { bindHostingAdapters } from "./actions/add-hosting/container";
import AddRouter from "./actions/add-router/AddRouter";
import { bindRouterAdapters } from "./actions/add-router/container";
import AddUIFramework from "./actions/add-ui-framework/AddUIFramework";
import { bindUIFrameworkAdapters } from "./actions/add-ui-framework/container";
import AddVersioning from "./actions/add-versioning/AddVersioning";
import { bindVersioningAdapters } from "./actions/add-versioning/container";
import { bindCreateAppAdapters } from "./actions/create-app/container";
import CreateApp from "./actions/create-app/CreateApp";
import CreateComponent from "./actions/create-component/CreateComponent";
import CreateCrudComponent from "./actions/create-component/CreateCrudComponent";
import GenerateReadme from "./actions/generate-readme/GenerateReadme";
import { CliService } from "./services/CliService";
import { ConsoleService } from "./services/ConsoleService";
import { FileDiffService } from "./services/file/FileDiffService";
import { FileFactory } from "./services/file/FileFactory";
import { FileService } from "./services/file/FileService";
import { GitService } from "./services/git/GitService";
import { PackageManagerService } from "./services/package-manager/PackageManagerService";
import { bindTemplateAdapters } from "./services/template/container";
import { TemplateFileService } from "./services/template/TemplateFileService";
import { TemplateService } from "./services/template/TemplateService";

const container = new Container({ defaultScope: "Singleton" });

export const TYPES = {
  Action: "Action",
};

// Services
container.bind<PackageManagerService>(PackageManagerService).toSelf();
container.bind<GitService>(GitService).toSelf();
container.bind<TemplateFileService>(TemplateFileService).toSelf();
container.bind<TemplateService>(TemplateService).toSelf();
container.bind<ConsoleService>(ConsoleService).toSelf();
container.bind<FileService>(FileService).toSelf();
container.bind<FileDiffService>(FileDiffService).toSelf();
container.bind<FileFactory>(FileFactory).toSelf();
container.bind<CliService>(CliService).toSelf();

// Available root actions
container.bind<CreateApp>(TYPES.Action).to(CreateApp);
container.bind<CreateApp>(CreateApp).toSelf();
container.bind<CreateComponent>(TYPES.Action).to(CreateComponent);
container.bind<CreateComponent>(CreateComponent).toSelf();
container.bind<CreateCrudComponent>(TYPES.Action).to(CreateCrudComponent);
container.bind<CreateCrudComponent>(CreateCrudComponent).toSelf();
container.bind<GenerateReadme>(TYPES.Action).to(GenerateReadme);
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
bindTemplateAdapters(container);

export default container;
