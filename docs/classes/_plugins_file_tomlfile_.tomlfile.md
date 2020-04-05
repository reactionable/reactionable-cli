[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/TomlFile"](../modules/_plugins_file_tomlfile_.md) › [TomlFile](_plugins_file_tomlfile_.tomlfile.md)

# Class: TomlFile

## Hierarchy

* [StdFile](_plugins_file_stdfile_.stdfile.md)

  ↳ **TomlFile**

## Index

### Constructors

* [constructor](_plugins_file_tomlfile_.tomlfile.md#constructor)

### Properties

* [content](_plugins_file_tomlfile_.tomlfile.md#protected-content)
* [data](_plugins_file_tomlfile_.tomlfile.md#protected-optional-data)
* [encoding](_plugins_file_tomlfile_.tomlfile.md#protected-encoding)
* [file](_plugins_file_tomlfile_.tomlfile.md#protected-file)

### Methods

* [appendContent](_plugins_file_tomlfile_.tomlfile.md#appendcontent)
* [appendData](_plugins_file_tomlfile_.tomlfile.md#appenddata)
* [fixContentEOL](_plugins_file_tomlfile_.tomlfile.md#protected-fixcontenteol)
* [getContent](_plugins_file_tomlfile_.tomlfile.md#getcontent)
* [getContentDiff](_plugins_file_tomlfile_.tomlfile.md#protected-getcontentdiff)
* [getData](_plugins_file_tomlfile_.tomlfile.md#getdata)
* [parseContent](_plugins_file_tomlfile_.tomlfile.md#protected-parsecontent)
* [replaceContent](_plugins_file_tomlfile_.tomlfile.md#replacecontent)
* [saveFile](_plugins_file_tomlfile_.tomlfile.md#savefile)
* [setContent](_plugins_file_tomlfile_.tomlfile.md#protected-setcontent)

## Constructors

###  constructor

\+ **new TomlFile**(`file`: string | null, `encoding`: string, `content`: string): *[TomlFile](_plugins_file_tomlfile_.tomlfile.md)*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[constructor](_plugins_file_stdfile_.stdfile.md#constructor)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L10)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string | "utf8" |
`content` | string | "" |

**Returns:** *[TomlFile](_plugins_file_tomlfile_.tomlfile.md)*

## Properties

### `Protected` content

• **content**: *string* = ""

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[content](_plugins_file_stdfile_.stdfile.md#protected-content)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L10)*

___

### `Protected` `Optional` data

• **data**? : *JsonMap*

*Defined in [plugins/file/TomlFile.ts:7](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L7)*

___

### `Protected` encoding

• **encoding**: *string*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[encoding](_plugins_file_stdfile_.stdfile.md#protected-encoding)*

*Defined in [plugins/file/StdFile.ts:13](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L13)*

___

### `Protected` file

• **file**: *string | null*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[file](_plugins_file_stdfile_.stdfile.md#protected-file)*

*Defined in [plugins/file/StdFile.ts:12](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L12)*

## Methods

###  appendContent

▸ **appendContent**(`content`: string, `after?`: undefined | string, `onlyIfNotExists`: boolean): *this*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[appendContent](_plugins_file_stdfile_.stdfile.md#appendcontent)*

*Defined in [plugins/file/TomlFile.ts:20](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L20)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`content` | string | - |
`after?` | undefined &#124; string | - |
`onlyIfNotExists` | boolean | true |

**Returns:** *this*

___

###  appendData

▸ **appendData**(`data`: JsonMap): *this*

*Defined in [plugins/file/TomlFile.ts:24](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | JsonMap |

**Returns:** *this*

___

### `Protected` fixContentEOL

▸ **fixContentEOL**(`content`: string): *string*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[fixContentEOL](_plugins_file_stdfile_.stdfile.md#protected-fixcontenteol)*

*Defined in [plugins/file/StdFile.ts:28](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  getContent

▸ **getContent**(): *string*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[getContent](_plugins_file_stdfile_.stdfile.md#getcontent)*

*Defined in [plugins/file/TomlFile.ts:16](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L16)*

**Returns:** *string*

___

### `Protected` getContentDiff

▸ **getContentDiff**(`content`: any): *Change[]*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[getContentDiff](_plugins_file_stdfile_.stdfile.md#protected-getcontentdiff)*

*Defined in [plugins/file/StdFile.ts:32](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | any |

**Returns:** *Change[]*

___

###  getData

▸ **getData**(`property?`: undefined): *JsonMap | undefined*

*Defined in [plugins/file/TomlFile.ts:34](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`property?` | undefined |

**Returns:** *JsonMap | undefined*

___

### `Protected` parseContent

▸ **parseContent**(`content`: string): *string*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[parseContent](_plugins_file_stdfile_.stdfile.md#protected-parsecontent)*

*Defined in [plugins/file/TomlFile.ts:10](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TomlFile.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  replaceContent

▸ **replaceContent**(`search`: RegExp, `replacement`: string): *this*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[replaceContent](_plugins_file_stdfile_.stdfile.md#replacecontent)*

*Defined in [plugins/file/StdFile.ts:40](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`search` | RegExp |
`replacement` | string |

**Returns:** *this*

___

###  saveFile

▸ **saveFile**(`file`: string | null, `encoding`: string | null): *Promise‹this›*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[saveFile](_plugins_file_stdfile_.stdfile.md#savefile)*

*Defined in [plugins/file/StdFile.ts:77](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L77)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string &#124; null | null |

**Returns:** *Promise‹this›*

___

### `Protected` setContent

▸ **setContent**(`content`: string): *this*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[setContent](_plugins_file_stdfile_.stdfile.md#protected-setcontent)*

*Defined in [plugins/file/StdFile.ts:19](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/StdFile.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *this*
