[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/create-component/CreateComponent"](../modules/_actions_create_component_createcomponent_.md) › [CreateComponent](_actions_create_component_createcomponent_.createcomponent.md)

# Class: CreateComponent

## Hierarchy

* **CreateComponent**

  ↳ [CreateCrudComponent](_actions_create_component_createcrudcomponent_.createcrudcomponent.md)

## Implements

* [IAction](../interfaces/_actions_iaction_.iaction.md)‹object›

## Index

### Constructors

* [constructor](_actions_create_component_createcomponent_.createcomponent.md#constructor)

### Properties

* [defaultPackage](_actions_create_component_createcomponent_.createcomponent.md#static-protected-defaultpackage)
* [templateNamespace](_actions_create_component_createcomponent_.createcomponent.md#static-protected-templatenamespace)
* [viewsPath](_actions_create_component_createcomponent_.createcomponent.md#static-protected-viewspath)

### Methods

* [createComponent](_actions_create_component_createcomponent_.createcomponent.md#createcomponent)
* [formatName](_actions_create_component_createcomponent_.createcomponent.md#formatname)
* [getHostingPackage](_actions_create_component_createcomponent_.createcomponent.md#gethostingpackage)
* [getName](_actions_create_component_createcomponent_.createcomponent.md#getname)
* [getProjectRootPath](_actions_create_component_createcomponent_.createcomponent.md#getprojectrootpath)
* [getUIPackage](_actions_create_component_createcomponent_.createcomponent.md#getuipackage)
* [run](_actions_create_component_createcomponent_.createcomponent.md#run)

## Constructors

###  constructor

\+ **new CreateComponent**(`addUIFramework`: [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md), `addHosting`: [AddHosting](_actions_add_hosting_addhosting_.addhosting.md)): *[CreateComponent](_actions_create_component_createcomponent_.createcomponent.md)*

*Defined in [actions/create-component/CreateComponent.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`addUIFramework` | [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md) |
`addHosting` | [AddHosting](_actions_add_hosting_addhosting_.addhosting.md) |

**Returns:** *[CreateComponent](_actions_create_component_createcomponent_.createcomponent.md)*

## Properties

### `Static` `Protected` defaultPackage

▪ **defaultPackage**: *string* = "@reactionable/core"

*Defined in [actions/create-component/CreateComponent.ts:18](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L18)*

___

### `Static` `Protected` templateNamespace

▪ **templateNamespace**: *string* = "create-component"

*Defined in [actions/create-component/CreateComponent.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L20)*

___

### `Static` `Protected` viewsPath

▪ **viewsPath**: *string* = join('', 'src', 'views')

*Defined in [actions/create-component/CreateComponent.ts:19](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L19)*

## Methods

###  createComponent

▸ **createComponent**(`__namedParameters`: object): *Promise‹string›*

*Defined in [actions/create-component/CreateComponent.ts:54](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L54)*

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

*Defined in [actions/create-component/CreateComponent.ts:110](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *string*

___

###  getHostingPackage

▸ **getHostingPackage**(`realpath`: string): *Promise‹string›*

*Defined in [actions/create-component/CreateComponent.ts:123](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹string›*

___

###  getName

▸ **getName**(): *string*

*Defined in [actions/create-component/CreateComponent.ts:27](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L27)*

**Returns:** *string*

___

###  getProjectRootPath

▸ **getProjectRootPath**(`realpath`: string): *string*

*Defined in [actions/create-component/CreateComponent.ts:131](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *string*

___

###  getUIPackage

▸ **getUIPackage**(`realpath`: string): *Promise‹string›*

*Defined in [actions/create-component/CreateComponent.ts:115](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹string›*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Defined in [actions/create-component/CreateComponent.ts:31](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/create-component/CreateComponent.ts#L31)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`name` | any |
`realpath` | any |

**Returns:** *Promise‹void›*
