[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/StdFile"](../modules/_plugins_file_stdfile_.md) › [StdFile](_plugins_file_stdfile_.stdfile.md)

# Class: StdFile

## Hierarchy

* **StdFile**

  ↳ [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md)

  ↳ [TomlFile](_plugins_file_tomlfile_.tomlfile.md)

  ↳ [JsonFile](_plugins_file_jsonfile_.jsonfile.md)

## Index

### Constructors

* [constructor](_plugins_file_stdfile_.stdfile.md#constructor)

### Properties

* [content](_plugins_file_stdfile_.stdfile.md#protected-content)
* [encoding](_plugins_file_stdfile_.stdfile.md#protected-encoding)
* [file](_plugins_file_stdfile_.stdfile.md#protected-file)

### Methods

* [appendContent](_plugins_file_stdfile_.stdfile.md#appendcontent)
* [fixContentEOL](_plugins_file_stdfile_.stdfile.md#protected-fixcontenteol)
* [getContent](_plugins_file_stdfile_.stdfile.md#getcontent)
* [getContentDiff](_plugins_file_stdfile_.stdfile.md#protected-getcontentdiff)
* [parseContent](_plugins_file_stdfile_.stdfile.md#protected-parsecontent)
* [replaceContent](_plugins_file_stdfile_.stdfile.md#replacecontent)
* [saveFile](_plugins_file_stdfile_.stdfile.md#savefile)
* [setContent](_plugins_file_stdfile_.stdfile.md#protected-setcontent)

## Constructors

###  constructor

\+ **new StdFile**(`file`: string | null, `encoding`: string, `content`: string): *[StdFile](_plugins_file_stdfile_.stdfile.md)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string | "utf8" |
`content` | string | "" |

**Returns:** *[StdFile](_plugins_file_stdfile_.stdfile.md)*

## Properties

### `Protected` content

• **content**: *string* = ""

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

___

### `Protected` encoding

• **encoding**: *string*

*Defined in [plugins/file/StdFile.ts:13](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L13)*

___

### `Protected` file

• **file**: *string | null*

*Defined in [plugins/file/StdFile.ts:12](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L12)*

## Methods

###  appendContent

▸ **appendContent**(`content`: string, `after?`: undefined | string, `onlyIfNotExists`: boolean): *this*

*Defined in [plugins/file/StdFile.ts:46](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L46)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`content` | string | - |
`after?` | undefined &#124; string | - |
`onlyIfNotExists` | boolean | true |

**Returns:** *this*

___

### `Protected` fixContentEOL

▸ **fixContentEOL**(`content`: string): *string*

*Defined in [plugins/file/StdFile.ts:28](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  getContent

▸ **getContent**(): *string*

*Defined in [plugins/file/StdFile.ts:36](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L36)*

**Returns:** *string*

___

### `Protected` getContentDiff

▸ **getContentDiff**(`content`: any): *Change[]*

*Defined in [plugins/file/StdFile.ts:32](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | any |

**Returns:** *Change[]*

___

### `Protected` parseContent

▸ **parseContent**(`content`: string): *string*

*Defined in [plugins/file/StdFile.ts:24](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  replaceContent

▸ **replaceContent**(`search`: RegExp, `replacement`: string): *this*

*Defined in [plugins/file/StdFile.ts:40](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L40)*

**Parameters:**

Name | Type |
------ | ------ |
`search` | RegExp |
`replacement` | string |

**Returns:** *this*

___

###  saveFile

▸ **saveFile**(`file`: string | null, `encoding`: string | null): *Promise‹this›*

*Defined in [plugins/file/StdFile.ts:77](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L77)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string &#124; null | null |

**Returns:** *Promise‹this›*

___

### `Protected` setContent

▸ **setContent**(`content`: string): *this*

*Defined in [plugins/file/StdFile.ts:19](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *this*
