import 'reflect-metadata';

import { Container } from 'inversify';

import AddHosting from './actions/add-hosting/AddHosting';
import { bindHostingAdapters } from './actions/add-hosting/container';
import AddCssFramework from './actions/add-ui-framework/AddUIFramework';
import { bindUIFrameworkAdapters } from './actions/add-ui-framework/container';
import AddVersioning from './actions/add-versioning/AddVersioning';
import { bindVersioningAdapters } from './actions/add-versioning/container';
import CreateComponent from './actions/create-component/CreateComponent';
import CreateCrudComponent from './actions/create-component/CreateCrudComponent';
import CreateReactApp from './actions/create-react-app/CreateReactApp';
import GenerateReadme from './actions/generate-readme/GenerateReadme';
import { NamedAction } from './actions/NamedAction';
import { CliService } from './services/CliService';
import { ConsoleService } from './services/ConsoleService';
import { FileFactory } from './services/file/FileFactory';
import { FileService } from './services/file/FileService';
import { ConventionalCommitsService } from './services/git/ConventionalCommitsService';
import { GitService } from './services/git/GitService';
import { PackageManagerService } from './services/package-manager/PackageManagerService';
import { TemplateService } from './services/TemplateService';

const container = new Container({ defaultScope: 'Singleton' });

// Services
container.bind<PackageManagerService>(PackageManagerService).toSelf();
container.bind<GitService>(GitService).toSelf();
container.bind<TemplateService>(TemplateService).toSelf();
container.bind<ConventionalCommitsService>(ConventionalCommitsService).toSelf();
container.bind<ConsoleService>(ConsoleService).toSelf();
container.bind<FileService>(FileService).toSelf();
container.bind<FileFactory>(FileFactory).toSelf();
container.bind<CliService>(CliService).toSelf();

// Available root actions
container.bind<CreateReactApp>('Action').to(CreateReactApp);
container.bind<NamedAction>(CreateReactApp).toSelf();
container.bind<CreateComponent>('Action').to(CreateComponent);
container.bind<CreateComponent>(CreateComponent).toSelf();
container.bind<CreateCrudComponent>('Action').to(CreateCrudComponent);
container.bind<CreateCrudComponent>(CreateCrudComponent).toSelf();
container.bind<GenerateReadme>('Action').to(GenerateReadme);
container.bind<GenerateReadme>(GenerateReadme).toSelf();

// Sub actions
container.bind<AddCssFramework>(AddCssFramework).toSelf();
container.bind<AddHosting>(AddHosting).toSelf();
container.bind<AddVersioning>(AddVersioning).toSelf();

// Bind adapters
bindHostingAdapters(container);
bindUIFrameworkAdapters(container);
bindVersioningAdapters(container);

export default container;
