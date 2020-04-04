[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/add-versioning/adapters/AbstractVersioning"](../modules/_actions_add_versioning_adapters_abstractversioning_.md) › [AbstractVersioning](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md)

# Class: AbstractVersioning <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md)

  ↳ **AbstractVersioning**

  ↳ [Git](_actions_add_versioning_adapters_github_github_.git.md)

## Implements

* [IRealpathRunnable](../interfaces/_actions_irealpathrunnable_.irealpathrunnable.md)‹O›
* [IVersioningAdapter](../interfaces/_actions_add_versioning_iversioningadapter_.iversioningadapter.md)

## Index

### Properties

* [name](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#protected-abstract-name)
* [conventionalCommitsPackages](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#static-conventionalcommitspackages)

### Methods

* [commitFiles](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#commitfiles)
* [getCommitMessage](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#getcommitmessage)
* [getName](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#getname)
* [hasConventionalCommits](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#hasconventionalcommits)
* [isEnabled](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#abstract-isenabled)
* [run](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#run)
* [validateGitRemote](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#validategitremote)

### Object literals

* [conventionalCommitsConfig](_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md#static-conventionalcommitsconfig)

## Properties

### `Protected` `Abstract` name

• **name**: *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[name](_actions_abstractadapter_.abstractadapter.md#protected-abstract-name)*

*Defined in [actions/AbstractAdapter.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L9)*

___

### `Static` conventionalCommitsPackages

▪ **conventionalCommitsPackages**: *string[]* = [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'cz-conventional-changelog',
        'husky',
    ]

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:14](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L14)*

## Methods

###  commitFiles

▸ **commitFiles**(`realpath`: string, `commitMessage`: string, `commitMessageType`: string): *Promise‹void›*

*Implementation of [IVersioningAdapter](../interfaces/_actions_add_versioning_iversioningadapter_.iversioningadapter.md)*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:112](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L112)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |
`commitMessage` | string |
`commitMessageType` | string |

**Returns:** *Promise‹void›*

___

###  getCommitMessage

▸ **getCommitMessage**(`realpath`: string, `commitMessage`: string, `commitMessageType`: string): *string*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:105](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L105)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |
`commitMessage` | string |
`commitMessageType` | string |

**Returns:** *string*

___

###  getName

▸ **getName**(): *string*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[getName](_actions_abstractadapter_.abstractadapter.md#getname)*

*Defined in [actions/AbstractAdapter.ts:11](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L11)*

**Returns:** *string*

___

###  hasConventionalCommits

▸ **hasConventionalCommits**(`realpath`: string): *boolean*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:96](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *boolean*

___

### `Abstract` isEnabled

▸ **isEnabled**(`realpath`: string): *Promise‹boolean›*

*Implementation of [IVersioningAdapter](../interfaces/_actions_add_versioning_iversioningadapter_.iversioningadapter.md)*

*Inherited from [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[isEnabled](_actions_abstractadapter_.abstractadapter.md#abstract-isenabled)*

*Defined in [actions/AbstractAdapter.ts:15](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/AbstractAdapter.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`realpath` | string |

**Returns:** *Promise‹boolean›*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Overrides [AbstractAdapter](_actions_abstractadapter_.abstractadapter.md).[run](_actions_abstractadapter_.abstractadapter.md#abstract-run)*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:34](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L34)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`realpath` | any |

**Returns:** *Promise‹void›*

___

###  validateGitRemote

▸ **validateGitRemote**(`input`: string): *string | Result*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:92](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`input` | string |

**Returns:** *string | Result*

## Object literals

### `Static` conventionalCommitsConfig

### ▪ **conventionalCommitsConfig**: *object*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:21](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L21)*

▪ **config**: *object*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:27](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L27)*

* **commitizen**: *object*

  * **path**: *string* = "./node_modules/cz-conventional-changelog"

▪ **husky**: *object*

*Defined in [actions/add-versioning/adapters/AbstractVersioning.ts:22](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/add-versioning/adapters/AbstractVersioning.ts#L22)*

* **hooks**: *object*

  * **commit-msg**: *string* = "commitlint -E HUSKY_GIT_PARAMS"
