[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/create-react-app/CreateReactApp"](../modules/_actions_create_react_app_createreactapp_.md) › [CreateReactApp](_actions_create_react_app_createreactapp_.createreactapp.md)

# Class: CreateReactApp

## Hierarchy

* **CreateReactApp**

## Implements

* [IAction](../interfaces/_actions_iaction_.iaction.md)

## Index

### Constructors

* [constructor](_actions_create_react_app_createreactapp_.createreactapp.md#constructor)

### Methods

* [getName](_actions_create_react_app_createreactapp_.createreactapp.md#getname)
* [run](_actions_create_react_app_createreactapp_.createreactapp.md#run)

## Constructors

###  constructor

\+ **new CreateReactApp**(`addUIFramework`: [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md), `addHosting`: [AddHosting](_actions_add_hosting_addhosting_.addhosting.md), `addVersioning`: [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md), `createComponent`: [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md), `generateReadme`: [GenerateReadme](_actions_generate_readme_generatereadme_.generatereadme.md)): *[CreateReactApp](_actions_create_react_app_createreactapp_.createreactapp.md)*

*Defined in [actions/create-react-app/CreateReactApp.ts:19](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-react-app/CreateReactApp.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`addUIFramework` | [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md) |
`addHosting` | [AddHosting](_actions_add_hosting_addhosting_.addhosting.md) |
`addVersioning` | [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md) |
`createComponent` | [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md) |
`generateReadme` | [GenerateReadme](_actions_generate_readme_generatereadme_.generatereadme.md) |

**Returns:** *[CreateReactApp](_actions_create_react_app_createreactapp_.createreactapp.md)*

## Methods

###  getName

▸ **getName**(): *string*

*Defined in [actions/create-react-app/CreateReactApp.ts:29](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-react-app/CreateReactApp.ts#L29)*

**Returns:** *string*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Defined in [actions/create-react-app/CreateReactApp.ts:33](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-react-app/CreateReactApp.ts#L33)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`realpath` | any |

**Returns:** *Promise‹void›*
