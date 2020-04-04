[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-versioning/IVersioningAdapter"](../modules/_actions_add_versioning_iversioningadapter_.md) › [IVersioningAdapter](_actions_add_versioning_iversioningadapter_.iversioningadapter.md)

# Interface: IVersioningAdapter <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

  ↳ [IAdapter](_actions_iadapter_.iadapter.md)‹O›

  ↳ **IVersioningAdapter**

## Implemented by

* [AbstractVersioning](../classes/_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md)
* [Git](../classes/_actions_add_versioning_adapters_github_github_.git.md)

## Index

### Properties

* [getName](_actions_add_versioning_iversioningadapter_.iversioningadapter.md#getname)
* [run](_actions_add_versioning_iversioningadapter_.iversioningadapter.md#run)

### Methods

* [commitFiles](_actions_add_versioning_iversioningadapter_.iversioningadapter.md#commitfiles)
* [isEnabled](_actions_add_versioning_iversioningadapter_.iversioningadapter.md#isenabled)

## Properties

###  getName

• **getName**: *function*

*Inherited from [IAdapter](_actions_iadapter_.iadapter.md).[getName](_actions_iadapter_.iadapter.md#getname)*

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

###  commitFiles

▸ **commitFiles**(`realpath`: string, `commitMessage`: string, `commitMessageType`: string): *Promise‹void›*

*Defined in [actions/add-versioning/IVersioningAdapter.ts:5](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/IVersioningAdapter.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |
`commitMessage` | string |
`commitMessageType` | string |

**Returns:** *Promise‹void›*

___

###  isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Inherited from [IAdapter](_actions_iadapter_.iadapter.md).[isEnabled](_actions_iadapter_.iadapter.md#isenabled)*

*Defined in [actions/IAdapter.ts:5](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IAdapter.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*
