[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/FileFactory"](../modules/_plugins_file_filefactory_.md) › [FileFactory](_plugins_file_filefactory_.filefactory.md)

# Class: FileFactory

## Hierarchy

* **FileFactory**

## Index

### Methods

* [fromFile](_plugins_file_filefactory_.filefactory.md#static-fromfile)
* [fromString](_plugins_file_filefactory_.filefactory.md#static-fromstring)

## Methods

### `Static` fromFile

▸ **fromFile**<**File**>(`file`: string, `encoding`: string): *File*

*Defined in [plugins/file/FileFactory.ts:25](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/FileFactory.ts#L25)*

**Type parameters:**

▪ **File**: *[StdFile](_plugins_file_stdfile_.stdfile.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string | - |
`encoding` | string | "utf8" |

**Returns:** *File*

___

### `Static` fromString

▸ **fromString**(`content`: string, `file`: string, `encoding`: string): *[StdFile](_plugins_file_stdfile_.stdfile.md)*

*Defined in [plugins/file/FileFactory.ts:54](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/FileFactory.ts#L54)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`content` | string | - |
`file` | string | - |
`encoding` | string | "utf8" |

**Returns:** *[StdFile](_plugins_file_stdfile_.stdfile.md)*
