[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/JsonFile"](../modules/_plugins_file_jsonfile_.md) › [JsonFile](_plugins_file_jsonfile_.jsonfile.md)

# Class: JsonFile

## Hierarchy

* [StdFile](_plugins_file_stdfile_.stdfile.md)

  ↳ **JsonFile**

## Index

### Constructors

* [constructor](_plugins_file_jsonfile_.jsonfile.md#constructor)

### Properties

* [content](_plugins_file_jsonfile_.jsonfile.md#protected-content)
* [data](_plugins_file_jsonfile_.jsonfile.md#protected-optional-data)
* [encoding](_plugins_file_jsonfile_.jsonfile.md#protected-encoding)
* [file](_plugins_file_jsonfile_.jsonfile.md#protected-file)

### Methods

* [appendContent](_plugins_file_jsonfile_.jsonfile.md#appendcontent)
* [appendData](_plugins_file_jsonfile_.jsonfile.md#appenddata)
* [fixContentEOL](_plugins_file_jsonfile_.jsonfile.md#protected-fixcontenteol)
* [getContent](_plugins_file_jsonfile_.jsonfile.md#getcontent)
* [getContentDiff](_plugins_file_jsonfile_.jsonfile.md#protected-getcontentdiff)
* [getData](_plugins_file_jsonfile_.jsonfile.md#getdata)
* [parseContent](_plugins_file_jsonfile_.jsonfile.md#protected-parsecontent)
* [replaceContent](_plugins_file_jsonfile_.jsonfile.md#replacecontent)
* [saveFile](_plugins_file_jsonfile_.jsonfile.md#savefile)
* [setContent](_plugins_file_jsonfile_.jsonfile.md#protected-setcontent)

## Constructors

###  constructor

\+ **new JsonFile**(`file`: string | null, `encoding`: string, `content`: string): *[JsonFile](_plugins_file_jsonfile_.jsonfile.md)*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[constructor](_plugins_file_stdfile_.stdfile.md#constructor)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string | "utf8" |
`content` | string | "" |

**Returns:** *[JsonFile](_plugins_file_jsonfile_.jsonfile.md)*

## Properties

### `Protected` content

• **content**: *string* = ""

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[content](_plugins_file_stdfile_.stdfile.md#protected-content)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

___

### `Protected` `Optional` data

• **data**? : *undefined | object*

*Defined in [plugins/file/JsonFile.ts:6](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L6)*

___

### `Protected` encoding

• **encoding**: *string*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[encoding](_plugins_file_stdfile_.stdfile.md#protected-encoding)*

*Defined in [plugins/file/StdFile.ts:13](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L13)*

___

### `Protected` file

• **file**: *string | null*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[file](_plugins_file_stdfile_.stdfile.md#protected-file)*

*Defined in [plugins/file/StdFile.ts:12](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L12)*

## Methods

###  appendContent

▸ **appendContent**(`content`: string, `after?`: undefined | string, `onlyIfNotExists`: boolean): *this*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[appendContent](_plugins_file_stdfile_.stdfile.md#appendcontent)*

*Defined in [plugins/file/JsonFile.ts:23](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L23)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`content` | string | - |
`after?` | undefined &#124; string | - |
`onlyIfNotExists` | boolean | true |

**Returns:** *this*

___

###  appendData

▸ **appendData**(`data`: object): *this*

*Defined in [plugins/file/JsonFile.ts:27](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | object |

**Returns:** *this*

___

### `Protected` fixContentEOL

▸ **fixContentEOL**(`content`: string): *string*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[fixContentEOL](_plugins_file_stdfile_.stdfile.md#protected-fixcontenteol)*

*Defined in [plugins/file/StdFile.ts:28](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  getContent

▸ **getContent**(): *string*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[getContent](_plugins_file_stdfile_.stdfile.md#getcontent)*

*Defined in [plugins/file/JsonFile.ts:19](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L19)*

**Returns:** *string*

___

### `Protected` getContentDiff

▸ **getContentDiff**(`content`: any): *Change[]*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[getContentDiff](_plugins_file_stdfile_.stdfile.md#protected-getcontentdiff)*

*Defined in [plugins/file/StdFile.ts:32](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | any |

**Returns:** *Change[]*

___

###  getData

▸ **getData**<**D**>(`property?`: undefined | string): *D | undefined*

*Defined in [plugins/file/JsonFile.ts:35](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L35)*

**Type parameters:**

▪ **D**

**Parameters:**

Name | Type |
------ | ------ |
`property?` | undefined &#124; string |

**Returns:** *D | undefined*

___

### `Protected` parseContent

▸ **parseContent**(`content`: string): *string*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[parseContent](_plugins_file_stdfile_.stdfile.md#protected-parsecontent)*

*Defined in [plugins/file/JsonFile.ts:8](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/JsonFile.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

###  replaceContent

▸ **replaceContent**(`search`: RegExp, `replacement`: string): *this*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[replaceContent](_plugins_file_stdfile_.stdfile.md#replacecontent)*

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

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[saveFile](_plugins_file_stdfile_.stdfile.md#savefile)*

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

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[setContent](_plugins_file_stdfile_.stdfile.md#protected-setcontent)*

*Defined in [plugins/file/StdFile.ts:19](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *this*
