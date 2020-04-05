[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/Git"](_plugins_git_.md)

# Module: "plugins/Git"

## Index

### Variables

* [parsedGitRemoteUrlCache](_plugins_git_.md#const-parsedgitremoteurlcache)

### Functions

* [getGitCmd](_plugins_git_.md#const-getgitcmd)
* [getGitConfig](_plugins_git_.md#const-getgitconfig)
* [getGitCurrentBranch](_plugins_git_.md#const-getgitcurrentbranch)
* [getGitRemoteOriginUrl](_plugins_git_.md#getgitremoteoriginurl)
* [initializedGit](_plugins_git_.md#const-initializedgit)
* [parseGitRemoteUrl](_plugins_git_.md#const-parsegitremoteurl)

## Variables

### `Const` parsedGitRemoteUrlCache

• **parsedGitRemoteUrlCache**: *object*

*Defined in [plugins/Git.ts:51](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L51)*

#### Type declaration:

* \[ **key**: *string*\]: Result | null

## Functions

### `Const` getGitCmd

▸ **getGitCmd**(): *string | null*

*Defined in [plugins/Git.ts:59](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L59)*

**Returns:** *string | null*

___

### `Const` getGitConfig

▸ **getGitConfig**(`dirPath`: string): *IIniObject*

*Defined in [plugins/Git.ts:29](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |

**Returns:** *IIniObject*

___

### `Const` getGitCurrentBranch

▸ **getGitCurrentBranch**(`dirPath`: string, `defaultBranch`: string): *string*

*Defined in [plugins/Git.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |
`defaultBranch` | string |

**Returns:** *string*

___

###  getGitRemoteOriginUrl

▸ **getGitRemoteOriginUrl**(`dirPath`: string, `parsed`: true): *Result | null*

*Defined in [plugins/Git.ts:37](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |
`parsed` | true |

**Returns:** *Result | null*

▸ **getGitRemoteOriginUrl**(`dirPath`: string, `parsed`: false): *string | null*

*Defined in [plugins/Git.ts:38](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |
`parsed` | false |

**Returns:** *string | null*

___

### `Const` initializedGit

▸ **initializedGit**(`dirPath`: string): *Promise‹void›*

*Defined in [plugins/Git.ts:10](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |

**Returns:** *Promise‹void›*

___

### `Const` parseGitRemoteUrl

▸ **parseGitRemoteUrl**(`remoteUrl`: string): *Result | null*

*Defined in [plugins/Git.ts:52](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/Git.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`remoteUrl` | string |

**Returns:** *Result | null*
