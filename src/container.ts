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

let container = new Container({ defaultScope: 'Singleton' });

// Actions
container.bind<IAction>('Action').to(CreateReactApp);
container.bind<IAction>('Action').to(CreateComponent);
container.bind<IAction>('Action').to(CreateCrudComponent);
container.bind<IAction>('Action').to(GenerateReadme);

// Direct services
container.bind<IAction>(GenerateReadme).toSelf();
container.bind<IAction>(CreateComponent).toSelf();
container.bind<IAction>(CreateCrudComponent).toSelf();
container.bind<AddCssFramework>(AddCssFramework).toSelf();
container.bind<AddHosting>(AddHosting).toSelf();
container.bind<AddVersioning>(AddVersioning).toSelf();

export default container;