[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/create-component/CreateCrudComponent"](../modules/_actions_create_component_createcrudcomponent_.md) › [CreateCrudComponent](_actions_create_component_createcrudcomponent_.createcrudcomponent.md)

# Class: CreateCrudComponent

## Hierarchy

* [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md)

  ↳ **CreateCrudComponent**

## Implements

* [IAction](../interfaces/_actions_iaction_.iaction.md)‹object›

## Index

### Constructors

* [constructor](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#constructor)

### Properties

* [defaultPackage](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#static-protected-defaultpackage)
* [templateNamespace](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#static-protected-templatenamespace)
* [viewsPath](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#static-protected-viewspath)

### Methods

* [createComponent](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#createcomponent)
* [formatName](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#formatname)
* [getHostingPackage](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#gethostingpackage)
* [getName](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#getname)
* [getProjectRootPath](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#getprojectrootpath)
* [getUIPackage](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#getuipackage)
* [run](_actions_create_component_createcrudcomponent_.createcrudcomponent.md#run)

## Constructors

###  constructor

\+ **new CreateCrudComponent**(`addUIFramework`: [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md), `addHosting`: [AddHosting](_actions_add_hosting_addhosting_.addhosting.md)): *[CreateCrudComponent](_actions_create_component_createcrudcomponent_.createcrudcomponent.md)*

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[constructor](_actions_create_component_createcomponent_.createcomponent.md#constructor)*

*Defined in [actions/create-component/CreateComponent.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`addUIFramework` | [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md) |
`addHosting` | [AddHosting](_actions_add_hosting_addhosting_.addhosting.md) |

**Returns:** *[CreateCrudComponent](_actions_create_component_createcrudcomponent_.createcrudcomponent.md)*

## Properties

### `Static` `Protected` defaultPackage

▪ **defaultPackage**: *string* = "@reactionable/core"

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[defaultPackage](_actions_create_component_createcomponent_.createcomponent.md#static-protected-defaultpackage)*

*Defined in [actions/create-component/CreateComponent.ts:18](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L18)*

___

### `Static` `Protected` templateNamespace

▪ **templateNamespace**: *string* = "create-component"

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[templateNamespace](_actions_create_component_createcomponent_.createcomponent.md#static-protected-templatenamespace)*

*Defined in [actions/create-component/CreateComponent.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L20)*

___

### `Static` `Protected` viewsPath

▪ **viewsPath**: *string* = join('', 'src', 'views')

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[viewsPath](_actions_create_component_createcomponent_.createcomponent.md#static-protected-viewspath)*

*Defined in [actions/create-component/CreateComponent.ts:19](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L19)*

## Methods

###  createComponent

▸ **createComponent**(`__namedParameters`: object): *Promise‹string›*

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[createComponent](_actions_create_component_createcomponent_.createcomponent.md#createcomponent)*

*Defined in [actions/create-component/CreateComponent.ts:54](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L54)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`componentTemplate` | string | "simple/Simple.tsx" |
`name` | any | - |
`realpath` | any | - |
`templateContext` | object | - |
`testComponentTemplate` | string | "simple/Simple.test.tsx" |

**Returns:** *Promise‹string›*

___

###  formatName

▸ **formatName**(`name`: string): *string*

*Overrides [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[formatName](_actions_create_component_createcomponent_.createcomponent.md#formatname)*

*Defined in [actions/create-component/CreateCrudComponent.ts:70](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateCrudComponent.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *string*

___

###  getHostingPackage

▸ **getHostingPackage**(`realpath`: string): *Promise‹string›*

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[getHostingPackage](_actions_create_component_createcomponent_.createcomponent.md#gethostingpackage)*

*Defined in [actions/create-component/CreateComponent.ts:123](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹string›*

___

###  getName

▸ **getName**(): *string*

*Overrides [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[getName](_actions_create_component_createcomponent_.createcomponent.md#getname)*

*Defined in [actions/create-component/CreateCrudComponent.ts:11](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateCrudComponent.ts#L11)*

**Returns:** *string*

___

###  getProjectRootPath

▸ **getProjectRootPath**(`realpath`: string): *string*

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[getProjectRootPath](_actions_create_component_createcomponent_.createcomponent.md#getprojectrootpath)*

*Defined in [actions/create-component/CreateComponent.ts:131](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *string*

___

###  getUIPackage

▸ **getUIPackage**(`realpath`: string): *Promise‹string›*

*Inherited from [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[getUIPackage](_actions_create_component_createcomponent_.createcomponent.md#getuipackage)*

*Defined in [actions/create-component/CreateComponent.ts:115](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateComponent.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹string›*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Overrides [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md).[run](_actions_create_component_createcomponent_.createcomponent.md#run)*

*Defined in [actions/create-component/CreateCrudComponent.ts:15](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/create-component/CreateCrudComponent.ts#L15)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`name` | any |
`realpath` | any |

**Returns:** *Promise‹void›*
