[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/ReactComponentFile"](../modules/_plugins_file_reactcomponentfile_.md) › [ReactComponentFile](_plugins_file_reactcomponentfile_.reactcomponentfile.md)

# Class: ReactComponentFile

## Hierarchy

  ↳ [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md)

  ↳ **ReactComponentFile**

## Index

### Constructors

* [constructor](_plugins_file_reactcomponentfile_.reactcomponentfile.md#constructor)

### Properties

* [content](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-content)
* [declarations](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-optional-declarations)
* [defaultDeclaration](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-optional-defaultdeclaration)
* [encoding](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-encoding)
* [file](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-file)
* [imports](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-optional-imports)

### Methods

* [addImports](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-addimports)
* [appendContent](_plugins_file_reactcomponentfile_.reactcomponentfile.md#appendcontent)
* [fixContentEOL](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-fixcontenteol)
* [getContent](_plugins_file_reactcomponentfile_.reactcomponentfile.md#getcontent)
* [getContentDiff](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-getcontentdiff)
* [parseContent](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-parsecontent)
* [removeImports](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-removeimports)
* [replaceContent](_plugins_file_reactcomponentfile_.reactcomponentfile.md#replacecontent)
* [saveFile](_plugins_file_reactcomponentfile_.reactcomponentfile.md#savefile)
* [setContent](_plugins_file_reactcomponentfile_.reactcomponentfile.md#protected-setcontent)
* [setImports](_plugins_file_reactcomponentfile_.reactcomponentfile.md#setimports)

## Constructors

###  constructor

\+ **new ReactComponentFile**(`file`: string | null, `encoding`: string, `content`: string): *[ReactComponentFile](_plugins_file_reactcomponentfile_.reactcomponentfile.md)*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[constructor](_plugins_file_stdfile_.stdfile.md#constructor)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`file` | string &#124; null | null |
`encoding` | string | "utf8" |
`content` | string | "" |

**Returns:** *[ReactComponentFile](_plugins_file_reactcomponentfile_.reactcomponentfile.md)*

## Properties

### `Protected` content

• **content**: *string* = ""

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[content](_plugins_file_stdfile_.stdfile.md#protected-content)*

*Defined in [plugins/file/StdFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/StdFile.ts#L10)*

___

### `Protected` `Optional` declarations

• **declarations**? : *Array‹string›*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[declarations](_plugins_file_typescriptfile_.typescriptfile.md#protected-optional-declarations)*

*Defined in [plugins/file/TypescriptFile.ts:9](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L9)*

___

### `Protected` `Optional` defaultDeclaration

• **defaultDeclaration**? : *string | null*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[defaultDeclaration](_plugins_file_typescriptfile_.typescriptfile.md#protected-optional-defaultdeclaration)*

*Defined in [plugins/file/TypescriptFile.ts:10](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L10)*

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

___

### `Protected` `Optional` imports

• **imports**? : *Array‹[TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)›*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[imports](_plugins_file_typescriptfile_.typescriptfile.md#protected-optional-imports)*

*Defined in [plugins/file/TypescriptFile.ts:8](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L8)*

## Methods

### `Protected` addImports

▸ **addImports**(`imports`: [TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)[]): *void*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[addImports](_plugins_file_typescriptfile_.typescriptfile.md#protected-addimports)*

*Defined in [plugins/file/TypescriptFile.ts:84](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`imports` | [TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)[] |

**Returns:** *void*

___

###  appendContent

▸ **appendContent**(`content`: string, `after?`: undefined | string, `onlyIfNotExists`: boolean): *this*

*Inherited from [StdFile](_plugins_file_stdfile_.stdfile.md).[appendContent](_plugins_file_stdfile_.stdfile.md#appendcontent)*

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

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[getContent](_plugins_file_typescriptfile_.typescriptfile.md#getcontent)*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[getContent](_plugins_file_stdfile_.stdfile.md#getcontent)*

*Defined in [plugins/file/TypescriptFile.ts:49](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L49)*

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

### `Protected` parseContent

▸ **parseContent**(`content`: string): *string*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[parseContent](_plugins_file_typescriptfile_.typescriptfile.md#protected-parsecontent)*

*Overrides [StdFile](_plugins_file_stdfile_.stdfile.md).[parseContent](_plugins_file_stdfile_.stdfile.md#protected-parsecontent)*

*Defined in [plugins/file/TypescriptFile.ts:12](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`content` | string |

**Returns:** *string*

___

### `Protected` removeImports

▸ **removeImports**(`imports`: [TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)[]): *void*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[removeImports](_plugins_file_typescriptfile_.typescriptfile.md#protected-removeimports)*

*Defined in [plugins/file/TypescriptFile.ts:103](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L103)*

**Parameters:**

Name | Type |
------ | ------ |
`imports` | [TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)[] |

**Returns:** *void*

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

___

###  setImports

▸ **setImports**(`importsToAdd`: Array‹[ITypescriptImport](../interfaces/_plugins_file_typescriptimport_.itypescriptimport.md)›, `importsToRemove`: Array‹[ITypescriptImport](../interfaces/_plugins_file_typescriptimport_.itypescriptimport.md)›): *this*

*Inherited from [TypescriptFile](_plugins_file_typescriptfile_.typescriptfile.md).[setImports](_plugins_file_typescriptfile_.typescriptfile.md#setimports)*

*Defined in [plugins/file/TypescriptFile.ts:66](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/file/TypescriptFile.ts#L66)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`importsToAdd` | Array‹[ITypescriptImport](../interfaces/_plugins_file_typescriptimport_.itypescriptimport.md)› | [] |
`importsToRemove` | Array‹[ITypescriptImport](../interfaces/_plugins_file_typescriptimport_.itypescriptimport.md)› | [] |

**Returns:** *this*
