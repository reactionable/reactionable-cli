[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/AbstractAdapterWithPackage"](../modules/_actions_abstractadapterwithpackage_.md) › [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)

# Class: AbstractAdapterWithPackage <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)‹O›

  ↳ **AbstractAdapterWithPackage**

  ↳ [ReactBootstrap](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md)

  ↳ [Amplify](_actions_add_hosting_adapters_amplify_amplify_.amplify.md)

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [name](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#protected-abstract-name)
* [packageName](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#protected-abstract-packagename)

### Methods

* [getName](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#getname)
* [getPackageName](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#getpackagename)
* [isEnabled](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#isenabled)
* [run](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#run)

## Properties

### `Protected` `Abstract` name

• **name**: *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[name](_actions_abstractadapter_.abstractadapter.md#protected-abstract-name)*

*Defined in [actions/AbstractAdapter.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L9)*

___

### `Protected` `Abstract` packageName

• **packageName**: *string*

*Defined in [actions/AbstractAdapterWithPackage.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapterWithPackage.ts#L10)*

## Methods

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[getName](_actions_abstractadapter_.abstractadapter.md#getname)*

*Defined in [actions/AbstractAdapter.ts:11](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L11)*

**Returns:** *string*

___

###  getPackageName

▸ **getPackageName**(): *string*

*Defined in [actions/AbstractAdapterWithPackage.ts:12](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapterWithPackage.ts#L12)*

**Returns:** *string*

___

###  isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[isEnabled](_actions_abstractadapter_.abstractadapter.md#abstract-isenabled)*

*Defined in [actions/AbstractAdapterWithPackage.ts:16](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapterWithPackage.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[run](_actions_abstractadapter_.abstractadapter.md#abstract-run)*

*Defined in [actions/AbstractAdapterWithPackage.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapterWithPackage.ts#L20)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`realpath` | any |

**Returns:** *Promise‹void›*
