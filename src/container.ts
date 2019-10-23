import 'reflect-metadata';
import { Container } from 'inversify';
import { IAction } from './actions/IAction';
import CreateReactApp from './actions/create-react-app/CreateReactApp';
import AddCssFramework from './actions/add-ui-framework/AddUIFramework';
import AddHosting from './actions/add-hosting/AddHosting';
import AddVersioning from './actions/add-versioning/AddVersioning';
import CreateComponent from './actions/create-component/CreateComponent';

let container = new Container({ defaultScope: 'Singleton' });

// Actions
container.bind<IAction>('Action').to(CreateReactApp);

// Others services
container.bind<IAction>(CreateComponent).toSelf();
container.bind<AddCssFramework>(AddCssFramework).toSelf();
container.bind<AddHosting>(AddHosting).toSelf();
container.bind<AddVersioning>(AddVersioning).toSelf();

export default container;