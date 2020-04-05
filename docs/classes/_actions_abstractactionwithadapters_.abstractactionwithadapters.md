[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/AbstractActionWithAdapters"](../modules/_actions_abstractactionwithadapters_.md) › [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md)

# Class: AbstractActionWithAdapters <**A, O**>

## Type parameters

▪ **A**: *[IAdapter](../interfaces/_actions_iadapter_.iadapter.md)*

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* **AbstractActionWithAdapters**

  ↳ [AddUIFramework](_actions_add_ui_framework_adduiframework_.adduiframework.md)

  ↳ [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md)

  ↳ [AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [container](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-container)
* [name](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-name)

### Methods

* [detectAdapter](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#detectadapter)
* [getAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-getadapters)
* [getName](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#getname)
* [run](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#run)

## Properties

### `Protected` `Abstract` container

• **container**: *Container*

*Defined in [actions/AbstractActionWithAdapters.ts:14](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L14)*

___

### `Protected` `Abstract` name

• **name**: *string*

*Defined in [actions/AbstractActionWithAdapters.ts:13](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L13)*

## Methods

###  detectAdapter

▸ **detectAdapter**(`realpath`: string): *Promise‹A | null›*

*Defined in [actions/AbstractActionWithAdapters.ts:24](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹A | null›*

___

### `Protected` getAdapters

▸ **getAdapters**(): *A[]*

*Defined in [actions/AbstractActionWithAdapters.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L20)*

**Returns:** *A[]*

___

###  getName

▸ **getName**(): *string*

*Defined in [actions/AbstractActionWithAdapters.ts:16](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L16)*

**Returns:** *string*

___

###  run

▸ **run**(`options`: any): *Promise‹void›*

*Defined in [actions/AbstractActionWithAdapters.ts:34](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractActionWithAdapters.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
