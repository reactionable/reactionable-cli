import 'reflect-metadata';
import { Container } from 'inversify';
import CreateReactApp from './actions/create-react-app/CreateReactApp';
import AddCssFramework from './actions/add-ui-framework/AddUIFramework';
import AddHosting from './actions/add-hosting/AddHosting';
import AddVersioning from './actions/add-versioning/AddVersioning';
import CreateComponent from './actions/create-component/CreateComponent';
import CreateCrudComponent from './actions/create-component/CreateCrudComponent';
import GenerateReadme from './actions/generate-readme/GenerateReadme';
import { IAction } from './actions/IAction';
import { PackageManagerService } from './services/package-manager/PackageManagerService';
import { FileService } from './services/file/FileService';
import { CliService } from './services/CliService';
import { GitService } from './services/git/GitService';
import { ConsoleService } from './services/ConsoleService';
import { ConventionalCommitsService } from './services/git/ConventionalCommitsService';
import { TemplateService } from './services/TemplateService';
import { FileFactory } from './services/file/FileFactory';
import { bindHostingAdapters } from './actions/add-hosting/container';
import { bindUIFrameworkAdapters } from './actions/add-ui-framework/container';
import { bindVersioningAdapters } from './actions/add-versioning/container';

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
container.bind<IAction>('Action').to(CreateReactApp);
container.bind<IAction>(CreateReactApp).toSelf();
container.bind<IAction>('Action').to(CreateComponent);
container.bind<IAction>(CreateComponent).toSelf();
container.bind<IAction>('Action').to(CreateCrudComponent);
container.bind<IAction>(CreateCrudComponent).toSelf();
container.bind<IAction>('Action').to(GenerateReadme);
container.bind<IAction>(GenerateReadme).toSelf();

// Sub actions
container.bind<AddCssFramework>(AddCssFramework).toSelf();
container.bind<AddHosting>(AddHosting).toSelf();
container.bind<AddVersioning>(AddVersioning).toSelf();

// Bind adapters
bindHostingAdapters(container);
bindUIFrameworkAdapters(container);
bindVersioningAdapters(container);

export default container;
