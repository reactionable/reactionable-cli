[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/generate-readme/GenerateReadme"](../modules/_actions_generate_readme_generatereadme_.md) › [GenerateReadme](_actions_generate_readme_generatereadme_.generatereadme.md)

# Class: GenerateReadme

## Hierarchy

* **GenerateReadme**

## Implements

* [IAction](../interfaces/_actions_iaction_.iaction.md)‹object›

## Index

### Constructors

* [constructor](_actions_generate_readme_generatereadme_.generatereadme.md#constructor)

### Methods

* [getName](_actions_generate_readme_generatereadme_.generatereadme.md#getname)
* [run](_actions_generate_readme_generatereadme_.generatereadme.md#run)

## Constructors

###  constructor

\+ **new GenerateReadme**(`addVersioning`: [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md)): *[GenerateReadme](_actions_generate_readme_generatereadme_.generatereadme.md)*

*Defined in [actions/generate-readme/GenerateReadme.ts:8](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/generate-readme/GenerateReadme.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`addVersioning` | [AddVersioning](_actions_add_versioning_addversioning_.addversioning.md) |

**Returns:** *[GenerateReadme](_actions_generate_readme_generatereadme_.generatereadme.md)*

## Methods

###  getName

▸ **getName**(): *string*

*Defined in [actions/generate-readme/GenerateReadme.ts:16](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/generate-readme/GenerateReadme.ts#L16)*

**Returns:** *string*

___

###  run

▸ **run**(`__namedParameters`: object): *Promise‹void›*

*Defined in [actions/generate-readme/GenerateReadme.ts:20](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/generate-readme/GenerateReadme.ts#L20)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`mustPrompt` | boolean | false |
`realpath` | any | - |

**Returns:** *Promise‹void›*
