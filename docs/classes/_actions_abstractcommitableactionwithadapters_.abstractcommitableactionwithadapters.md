[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/AbstractCommitableActionWithAdapters"](../modules/_actions_abstractcommitableactionwithadapters_.md) › [AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)

# Class: AbstractCommitableActionWithAdapters <**A, O**>

## Type parameters

▪ **A**: *[IAdapter](../interfaces/_actions_iadapter_.iadapter.md)*

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md)‹A, O›

  ↳ **AbstractCommitableActionWithAdapters**

  ↳ [AddHosting](_actions_add_hosting_addhosting_.addhosting.md)

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Constructors

* [constructor](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#constructor)

### Properties

* [container](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#protected-abstract-container)
* [name](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#protected-abstract-name)

### Methods

* [detectAdapter](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#detectadapter)
* [getAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#protected-getadapters)
* [getName](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#getname)
* [run](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#run)

## Constructors

###  constructor

\+ **new AbstractCommitableActionWithAdapters**(`addVersioning`: [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md)): *[AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)*

*Defined in [actions/AbstractCommitableActionWithAdapters.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractCommitableActionWithAdapters.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`addVersioning` | [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md) |

**Returns:** *[AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)*

## Properties

### `Protected` `Abstract` container

• **container**: *Container*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[container](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-container)*

*Defined in [actions/AbstractActionWithAdapters.ts:14](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L14)*

___

### `Protected` `Abstract` name

• **name**: *string*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[name](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-name)*

*Defined in [actions/AbstractActionWithAdapters.ts:13](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L13)*

## Methods

###  detectAdapter

▸ **detectAdapter**(`realpath`: string): *Promise‹A | null›*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[detectAdapter](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#detectadapter)*

*Defined in [actions/AbstractActionWithAdapters.ts:24](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹A | null›*

___

### `Protected` getAdapters

▸ **getAdapters**(): *A[]*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-getadapters)*

*Defined in [actions/AbstractActionWithAdapters.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L20)*

**Returns:** *A[]*

___

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getName](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#getname)*

*Defined in [actions/AbstractActionWithAdapters.ts:16](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L16)*

**Returns:** *string*

___

###  run

▸ **run**(`options`: any): *Promise‹void›*

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[run](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#run)*

*Defined in [actions/AbstractCommitableActionWithAdapters.ts:17](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractCommitableActionWithAdapters.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
