[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/template/Template"](_plugins_template_template_.md)

# Module: "plugins/template/Template"

## Index

### Type aliases

* [CompiledTemplate](_plugins_template_template_.md#compiledtemplate)
* [TemplateConfig](_plugins_template_template_.md#templateconfig)

### Variables

* [compiledTemplates](_plugins_template_template_.md#const-compiledtemplates)

### Functions

* [createFileFromTemplate](_plugins_template_template_.md#const-createfilefromtemplate)
* [getCompiledTemplateFile](_plugins_template_template_.md#const-getcompiledtemplatefile)
* [getCompiledTemplateString](_plugins_template_template_.md#const-getcompiledtemplatestring)
* [getTemplateFileContent](_plugins_template_template_.md#const-gettemplatefilecontent)
* [renderTemplateFile](_plugins_template_template_.md#const-rendertemplatefile)
* [renderTemplateString](_plugins_template_template_.md#const-rendertemplatestring)
* [renderTemplateTree](_plugins_template_template_.md#const-rendertemplatetree)

## Type aliases

###  CompiledTemplate

Ƭ **CompiledTemplate**: *function*

*Defined in [plugins/template/Template.ts:183](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L183)*

#### Type declaration:

▸ (`context`: Object): *string*

**Parameters:**

Name | Type |
------ | ------ |
`context` | Object |

___

###  TemplateConfig

Ƭ **TemplateConfig**: *string[] | object*

*Defined in [plugins/template/Template.ts:83](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L83)*

## Variables

### `Const` compiledTemplates

• **compiledTemplates**: *object*

*Defined in [plugins/template/Template.ts:184](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L184)*

#### Type declaration:

* \[ **key**: *string*\]: [CompiledTemplate](_plugins_template_template_.md#compiledtemplate)

## Functions

### `Const` createFileFromTemplate

▸ **createFileFromTemplate**(`filePath`: string, `namespace`: string, `context`: Object, `encoding`: string): *Promise‹void›*

*Defined in [plugins/template/Template.ts:135](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L135)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`filePath` | string | - |
`namespace` | string | - |
`context` | Object | - |
`encoding` | string | "utf8" |

**Returns:** *Promise‹void›*

___

### `Const` getCompiledTemplateFile

▸ **getCompiledTemplateFile**(`templateKey`: string): *Promise‹[CompiledTemplate](_plugins_template_template_.md#compiledtemplate)›*

*Defined in [plugins/template/Template.ts:198](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L198)*

**Parameters:**

Name | Type |
------ | ------ |
`templateKey` | string |

**Returns:** *Promise‹[CompiledTemplate](_plugins_template_template_.md#compiledtemplate)›*

___

### `Const` getCompiledTemplateString

▸ **getCompiledTemplateString**(`templateKey`: string, `templateContent`: string): *Promise‹[CompiledTemplate](_plugins_template_template_.md#compiledtemplate)›*

*Defined in [plugins/template/Template.ts:186](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L186)*

**Parameters:**

Name | Type |
------ | ------ |
`templateKey` | string |
`templateContent` | string |

**Returns:** *Promise‹[CompiledTemplate](_plugins_template_template_.md#compiledtemplate)›*

___

### `Const` getTemplateFileContent

▸ **getTemplateFileContent**(`template`: string): *Promise‹string›*

*Defined in [plugins/template/Template.ts:148](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *Promise‹string›*

___

### `Const` renderTemplateFile

▸ **renderTemplateFile**(`templateKey`: string, `context`: Object): *Promise‹string›*

*Defined in [plugins/template/Template.ts:209](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L209)*

**Parameters:**

Name | Type |
------ | ------ |
`templateKey` | string |
`context` | Object |

**Returns:** *Promise‹string›*

___

### `Const` renderTemplateString

▸ **renderTemplateString**(`template`: string, `context`: Object): *Promise‹string›*

*Defined in [plugins/template/Template.ts:193](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |
`context` | Object |

**Returns:** *Promise‹string›*

___

### `Const` renderTemplateTree

▸ **renderTemplateTree**(`dirPath`: string, `namespace`: string, `config`: [TemplateConfig](_plugins_template_template_.md#templateconfig), `context`: Object): *Promise‹void›*

*Defined in [plugins/template/Template.ts:87](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/plugins/template/Template.ts#L87)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dirPath` | string | - |
`namespace` | string | - |
`config` | [TemplateConfig](_plugins_template_template_.md#templateconfig) | - |
`context` | Object | {} |

**Returns:** *Promise‹void›*
