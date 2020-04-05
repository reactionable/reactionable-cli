[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-hosting/adapters/netlify/Netlify"](../modules/_actions_add_hosting_adapters_netlify_netlify_.md) › [Netlify](_actions_add_hosting_adapters_netlify_netlify_.netlify.md)

# Class: Netlify <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)

  ↳ **Netlify**

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

## Index

### Properties

* [name](_actions_add_hosting_adapters_netlify_netlify_.netlify.md#protected-name)

### Methods

* [getName](_actions_add_hosting_adapters_netlify_netlify_.netlify.md#getname)
* [isEnabled](_actions_add_hosting_adapters_netlify_netlify_.netlify.md#isenabled)
* [run](_actions_add_hosting_adapters_netlify_netlify_.netlify.md#run)

## Properties

### `Protected` name

• **name**: *string* = "Netlify (https://aws-amplify.github.io/)"

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[name](_actions_abstractadapter_.abstractadapter.md#protected-abstract-name)*

*Defined in [actions/add-hosting/adapters/netlify/Netlify.ts:15](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/add-hosting/adapters/netlify/Netlify.ts#L15)*

## Methods

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[getName](_actions_abstractadapter_.abstractadapter.md#getname)*

*Defined in [actions/AbstractAdapter.ts:11](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/AbstractAdapter.ts#L11)*

**Returns:** *string*

___

###  isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[isEnabled](_actions_abstractadapter_.abstractadapter.md#abstract-isenabled)*

*Defined in [actions/add-hosting/adapters/netlify/Netlify.ts:17](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/add-hosting/adapters/netlify/Netlify.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[run](_actions_abstractadapter_.abstractadapter.md#abstract-run)*

*Defined in [actions/add-hosting/adapters/netlify/Netlify.ts:21](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/actions/add-hosting/adapters/netlify/Netlify.ts#L21)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`realpath` | any |

**Returns:** *Promise‹void›*
