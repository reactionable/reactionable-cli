[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-ui-framework/adapters/ReactBootstrap"](../modules/_actions_add_ui_framework_adapters_reactbootstrap_.md) › [ReactBootstrap](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md)

# Class: ReactBootstrap <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

  ↳ [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)

  ↳ **ReactBootstrap**

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [name](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#protected-name)
* [packageName](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#protected-packagename)

### Methods

* [getName](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#getname)
* [getPackageName](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#getpackagename)
* [isEnabled](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#isenabled)
* [run](_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md#run)

## Properties

### `Protected` name

• **name**: *string* = "React Bootstrap (https://react-bootstrap.github.io)"

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[name](_actions_abstractadapter_.abstractadapter.md#protected-abstract-name)*

*Defined in [actions/add-ui-framework/adapters/ReactBootstrap.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-ui-framework/adapters/ReactBootstrap.ts#L10)*

___

### `Protected` packageName

• **packageName**: *string* = "@reactionable/ui-bootstrap"

*Overrides [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md).[packageName](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#protected-abstract-packagename)*

*Defined in [actions/add-ui-framework/adapters/ReactBootstrap.ts:11](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-ui-framework/adapters/ReactBootstrap.ts#L11)*

## Methods

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[getName](_actions_abstractadapter_.abstractadapter.md#getname)*

*Defined in [actions/AbstractAdapter.ts:11](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L11)*

**Returns:** *string*

___

###  getPackageName

▸ **getPackageName**(): *string*

*Inherited from [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md).[getPackageName](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#getpackagename)*

*Defined in [actions/AbstractAdapterWithPackage.ts:12](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapterWithPackage.ts#L12)*

**Returns:** *string*

___

###  isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Inherited from [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md).[isEnabled](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#isenabled)*

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

*Overrides [AbstractAdapterWithPackage](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md).[run](_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md#run)*

*Defined in [actions/add-ui-framework/adapters/ReactBootstrap.ts:14](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-ui-framework/adapters/ReactBootstrap.ts#L14)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`realpath` | any |

**Returns:** *Promise‹void›*
