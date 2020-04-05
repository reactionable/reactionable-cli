[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/file/TypescriptImport"](../modules/_plugins_file_typescriptimport_.md) › [TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)

# Class: TypescriptImport

## Hierarchy

* **TypescriptImport**

## Index

### Constructors

* [constructor](_plugins_file_typescriptimport_.typescriptimport.md#constructor)

### Properties

* [modules](_plugins_file_typescriptimport_.typescriptimport.md#modules)
* [packageName](_plugins_file_typescriptimport_.typescriptimport.md#packagename)
* [defaultImport](_plugins_file_typescriptimport_.typescriptimport.md#static-defaultimport)

### Methods

* [addModules](_plugins_file_typescriptimport_.typescriptimport.md#addmodules)
* [removeModules](_plugins_file_typescriptimport_.typescriptimport.md#removemodules)
* [toString](_plugins_file_typescriptimport_.typescriptimport.md#tostring)
* [fromString](_plugins_file_typescriptimport_.typescriptimport.md#static-fromstring)

## Constructors

###  constructor

\+ **new TypescriptImport**(`packageName`: string, `modules`: [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules)): *[TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)*

*Defined in [plugins/file/TypescriptImport.ts:9](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L9)*

**Parameters:**

Name | Type |
------ | ------ |
`packageName` | string |
`modules` | [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules) |

**Returns:** *[TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md)*

## Properties

###  modules

• **modules**: *[ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules)*

*Defined in [plugins/file/TypescriptImport.ts:11](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L11)*

___

###  packageName

• **packageName**: *string*

*Defined in [plugins/file/TypescriptImport.ts:11](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L11)*

___

### `Static` defaultImport

▪ **defaultImport**: *"default"* = "default"

*Defined in [plugins/file/TypescriptImport.ts:9](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L9)*

## Methods

###  addModules

▸ **addModules**(`modules`: [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules)): *void*

*Defined in [plugins/file/TypescriptImport.ts:50](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L50)*

**Parameters:**

Name | Type |
------ | ------ |
`modules` | [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules) |

**Returns:** *void*

___

###  removeModules

▸ **removeModules**(`modulesToRemove`: [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules)): *void*

*Defined in [plugins/file/TypescriptImport.ts:54](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`modulesToRemove` | [ITypescriptImportModules](../modules/_plugins_file_typescriptimport_.md#itypescriptimportmodules) |

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

*Defined in [plugins/file/TypescriptImport.ts:64](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L64)*

**Returns:** *string*

___

### `Static` fromString

▸ **fromString**(`line`: string): *[TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md) | null*

*Defined in [plugins/file/TypescriptImport.ts:13](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/file/TypescriptImport.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`line` | string |

**Returns:** *[TypescriptImport](_plugins_file_typescriptimport_.typescriptimport.md) | null*
