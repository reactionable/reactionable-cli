[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-hosting/AddHosting"](../modules/_actions_add_hosting_addhosting_.md) › [AddHosting](_actions_add_hosting_addhosting_.addhosting.md)

# Class: AddHosting <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

  ↳ [AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)›

  ↳ **AddHosting**

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Constructors

* [constructor](_actions_add_hosting_addhosting_.addhosting.md#constructor)

### Properties

* [container](_actions_add_hosting_addhosting_.addhosting.md#protected-container)
* [name](_actions_add_hosting_addhosting_.addhosting.md#protected-name)

### Methods

* [detectAdapter](_actions_add_hosting_addhosting_.addhosting.md#detectadapter)
* [getAdapters](_actions_add_hosting_addhosting_.addhosting.md#protected-getadapters)
* [getName](_actions_add_hosting_addhosting_.addhosting.md#getname)
* [run](_actions_add_hosting_addhosting_.addhosting.md#run)

## Constructors

###  constructor

\+ **new AddHosting**(`addVersioning`: [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md)): *[AddHosting](_actions_add_hosting_addhosting_.addhosting.md)*

*Inherited from [AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md).[constructor](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#constructor)*

*Defined in [actions/AbstractCommitableActionWithAdapters.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractCommitableActionWithAdapters.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`addVersioning` | [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md) |

**Returns:** *[AddHosting](_actions_add_hosting_addhosting_.addhosting.md)*

## Properties

### `Protected` container

• **container**: *Container‹›* = container

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[container](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-container)*

*Defined in [actions/add-hosting/AddHosting.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-hosting/AddHosting.ts#L10)*

___

### `Protected` name

• **name**: *string* = "Hosting"

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[name](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-abstract-name)*

*Defined in [actions/add-hosting/AddHosting.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-hosting/AddHosting.ts#L9)*

## Methods

###  detectAdapter

▸ **detectAdapter**(`realpath`: string): *Promise‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md) | null›*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[detectAdapter](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#detectadapter)*

*Defined in [actions/AbstractActionWithAdapters.ts:24](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md) | null›*

___

### `Protected` getAdapters

▸ **getAdapters**(): *[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)[]*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#protected-getadapters)*

*Defined in [actions/AbstractActionWithAdapters.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L20)*

**Returns:** *[AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md) | [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)[]*

___

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[getName](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#getname)*

*Defined in [actions/AbstractActionWithAdapters.ts:16](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractActionWithAdapters.ts#L16)*

**Returns:** *string*

___

###  run

▸ **run**(`options`: any): *Promise‹void›*

*Inherited from [AbstractCommitableActionWithAdapters](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md).[run](_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md#run)*

*Overrides [AbstractActionWithAdapters](_actions_abstractactionwithadapters_.abstractactionwithadapters.md).[run](_actions_abstractactionwithadapters_.abstractactionwithadapters.md#run)*

*Defined in [actions/AbstractCommitableActionWithAdapters.ts:17](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractCommitableActionWithAdapters.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
