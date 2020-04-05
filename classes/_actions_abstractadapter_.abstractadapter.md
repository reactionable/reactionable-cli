[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/AbstractAdapter"](../modules/_actions_abstractadapter_.md) › [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)

# Class: AbstractAdapter <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* **AbstractAdapter**

  ↳ [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)

  ↳ [Netlify](_actions_add_hosting_adapters_netlify_netlify_.netlify.md)

  ↳ [AbstractVersioning](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md)

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [name](_actions_abstractadapter_.abstractadapter.md#protected-abstract-name)

### Methods

* [getName](_actions_abstractadapter_.abstractadapter.md#getname)
* [isEnabled](_actions_abstractadapter_.abstractadapter.md#abstract-isenabled)
* [run](_actions_abstractadapter_.abstractadapter.md#abstract-run)

## Properties

### `Protected` `Abstract` name

• **name**: *string*

*Defined in [actions/AbstractAdapter.ts:9](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractAdapter.ts#L9)*

## Methods

###  getName

▸ **getName**(): *string*

*Defined in [actions/AbstractAdapter.ts:11](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractAdapter.ts#L11)*

**Returns:** *string*

___

### `Abstract` isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Defined in [actions/AbstractAdapter.ts:15](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractAdapter.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*

___

### `Abstract` run

▸ **run**(`options`: any): *Promise‹void›*

*Defined in [actions/AbstractAdapter.ts:16](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractAdapter.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *Promise‹void›*
