import 'reflect-metadata';
import { Container } from 'inversify';
import { IAction } from './actions/IAction';
import CreateReactApp from './actions/create-react-app/CreateReactApp';
import AddCssFramework from './actions/create-react-app/add-ui-framework/AddUIFramework';
import AddHosting from './actions/create-react-app/add-hosting/AddHosting';
import AddVersioning from './actions/create-react-app/add-versioning/AddVersioning';

let container = new Container({ defaultScope: 'Singleton' });

// Actions
container.bind<IAction>('Action').to(CreateReactApp);

// Others services
container.bind<AddCssFramework>(AddCssFramework).toSelf();
container.bind<AddHosting>(AddHosting).toSelf();
container.bind<AddVersioning>(AddVersioning).toSelf();

export default container;