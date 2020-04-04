[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/Cli"](_plugins_cli_.md)

# Module: "plugins/Cli"

## Index

### Variables

* [runStartDate](_plugins_cli_.md#let-runstartdate)

### Functions

* [error](_plugins_cli_.md#const-error)
* [exec](_plugins_cli_.md#const-exec)
* [getCmd](_plugins_cli_.md#const-getcmd)
* [getNodeVersion](_plugins_cli_.md#const-getnodeversion)
* [getNpmCmd](_plugins_cli_.md#const-getnpmcmd)
* [getRunStartDate](_plugins_cli_.md#const-getrunstartdate)
* [info](_plugins_cli_.md#const-info)
* [initRunStartDate](_plugins_cli_.md#const-initrunstartdate)
* [pause](_plugins_cli_.md#const-pause)
* [promptOverwriteFileDiff](_plugins_cli_.md#const-promptoverwritefilediff)
* [success](_plugins_cli_.md#const-success)

## Variables

### `Let` runStartDate

• **runStartDate**: *Date | undefined* = undefined

*Defined in [plugins/Cli.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L9)*

## Functions

### `Const` error

▸ **error**(`error`: Error | string): *void*

*Defined in [plugins/Cli.ts:91](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L91)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | Error &#124; string |

**Returns:** *void*

___

### `Const` exec

▸ **exec**(`cmd`: string, `cwd`: string, `silent`: boolean): *Promise‹string›*

*Defined in [plugins/Cli.ts:44](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L44)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`cmd` | string | - |
`cwd` | string | - |
`silent` | boolean | false |

**Returns:** *Promise‹string›*

___

### `Const` getCmd

▸ **getCmd**(`cmd`: string): *string | null*

*Defined in [plugins/Cli.ts:18](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`cmd` | string |

**Returns:** *string | null*

___

### `Const` getNodeVersion

▸ **getNodeVersion**(): *string*

*Defined in [plugins/Cli.ts:35](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L35)*

**Returns:** *string*

___

### `Const` getNpmCmd

▸ **getNpmCmd**(`cmd`: string): *string | null*

*Defined in [plugins/Cli.ts:25](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`cmd` | string |

**Returns:** *string | null*

___

### `Const` getRunStartDate

▸ **getRunStartDate**(): *Date | undefined*

*Defined in [plugins/Cli.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L10)*

**Returns:** *Date | undefined*

___

### `Const` info

▸ **info**(`message`: string): *void*

*Defined in [plugins/Cli.ts:83](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *void*

___

### `Const` initRunStartDate

▸ **initRunStartDate**(): *void*

*Defined in [plugins/Cli.ts:14](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L14)*

**Returns:** *void*

___

### `Const` pause

▸ **pause**(`message`: string): *Promise‹unknown›*

*Defined in [plugins/Cli.ts:155](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L155)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`message` | string | `Press any key to continue...` |

**Returns:** *Promise‹unknown›*

___

### `Const` promptOverwriteFileDiff

▸ **promptOverwriteFileDiff**(`file`: string, `diff`: Change[]): *Promise‹boolean›*

*Defined in [plugins/Cli.ts:99](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L99)*

**Parameters:**

Name | Type |
------ | ------ |
`file` | string |
`diff` | Change[] |

**Returns:** *Promise‹boolean›*

___

### `Const` success

▸ **success**(`message`: string): *void*

*Defined in [plugins/Cli.ts:87](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/Cli.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *void*
