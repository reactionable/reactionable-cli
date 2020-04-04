[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/IAdapter"](../modules/_actions_iadapter_.md) › [IAdapter](_actions_iadapter_.iadapter.md)

# Interface: IAdapter <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

  ↳ [IRealpathRunnable](_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

  ↳ **IAdapter**

  ↳ [IVersioningAdapter](_actions_add_versioning_iversioningadapter_.iversioningadapter.md)

## Index

### Properties

* [getName](_actions_iadapter_.iadapter.md#getname)
* [run](_actions_iadapter_.iadapter.md#run)

### Methods

* [isEnabled](_actions_iadapter_.iadapter.md#isenabled)

## Properties

###  getName

• **getName**: *function*

*Defined in [actions/IAdapter.ts:6](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IAdapter.ts#L6)*

#### Type declaration:

▸ (): *string*

___

###  run

• **run**: *function*

*Inherited from [IRunnable](_actions_irunnable_.irunnable.md).[run](_actions_irunnable_.irunnable.md#run)*

*Defined in [actions/IRunnable.ts:4](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IRunnable.ts#L4)*

#### Type declaration:

▸ (`options`: [IRealpathRunnableOptions](_actions_irealpathrunnable_.irealpathrunnableoptions.md) & O): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IRealpathRunnableOptions](_actions_irealpathrunnable_.irealpathrunnableoptions.md) & O |

## Methods

###  isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Defined in [actions/IAdapter.ts:5](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IAdapter.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*
