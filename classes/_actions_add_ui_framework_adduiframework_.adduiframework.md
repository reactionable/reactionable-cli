[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-ui-framework/AddUIFramework"](../modules/_actions_add_ui_framework_adduiframework_.md) › [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md)

# Class: AddUIFramework <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md)‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)›

  ↳ **AddUIFramework**

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [container](_actions_add_ui_framework_adduiframework_.adduiframework.md#protected-container)
* [name](_actions_add_ui_framework_adduiframework_.adduiframework.md#protected-name)

### Methods

* [detectAdapter](_actions_add_ui_framework_adduiframework_.adduiframework.md#detectadapter)
* [getAdapters](_actions_add_ui_framework_adduiframework_.adduiframework.md#protected-getadapters)
* [getName](_actions_add_ui_framework_adduiframework_.adduiframework.md#getname)
* [run](_actions_add_ui_framework_adduiframework_.adduiframework.md#run)

## Properties

### `Protected` container

• **container**: *Container‹›* = container

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[container](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-container)*

*Defined in [actions/add-ui-framework/AddUIFramework.ts:9](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/add-ui-framework/AddUIFramework.ts#L9)*

___

### `Protected` name

• **name**: *string* = "UI Framework"

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[name](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-name)*

*Defined in [actions/add-ui-framework/AddUIFramework.ts:8](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/add-ui-framework/AddUIFramework.ts#L8)*

## Methods

###  detectAdapter

▸ **detectAdapter**(`realpath`: string): *Promise‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | null›*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[detectAdapter](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#detectadapter)*

*Defined in [actions/AbstractActionWithAdapters.ts:24](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | null›*

___

### `Protected` getAdapters

▸ **getAdapters**(): *[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)[]*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-getadapters)*

*Defined in [actions/AbstractActionWithAdapters.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L20)*

**Returns:** *[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)[]*

___

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getName](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#getname)*

*Defined in [actions/AbstractActionWithAdapters.ts:16](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L16)*

**Returns:** *string*

___

###  run

▸ **run**(`options`: any): *Promise‹void›*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[run](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#run)*

*Defined in [actions/AbstractActionWithAdapters.ts:34](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
