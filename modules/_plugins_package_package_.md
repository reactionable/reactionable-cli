[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["plugins/package/Package"](_plugins_package_package_.md)

# Module: "plugins/package/Package"

## Index

### Enumerations

* [PackageManager](../enums/_plugins_package_package_.packagemanager.md)

### Functions

* [getPackageInfo](_plugins_package_package_.md#const-getpackageinfo)
* [getPackageJsonPath](_plugins_package_package_.md#const-getpackagejsonpath)
* [getPackageManager](_plugins_package_package_.md#const-getpackagemanager)
* [hasInstalledPackage](_plugins_package_package_.md#const-hasinstalledpackage)
* [hasPackageJsonConfig](_plugins_package_package_.md#const-haspackagejsonconfig)
* [installDevPackages](_plugins_package_package_.md#const-installdevpackages)
* [installPackages](_plugins_package_package_.md#const-installpackages)
* [updatePackageJson](_plugins_package_package_.md#const-updatepackagejson)

## Functions

### `Const` getPackageInfo

▸ **getPackageInfo**(`dirPath`: string, `property?`: undefined | string, `encoding`: string): *any*

*Defined in [plugins/package/Package.ts:137](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L137)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dirPath` | string | - |
`property?` | undefined &#124; string | - |
`encoding` | string | "utf8" |

**Returns:** *any*

___

### `Const` getPackageJsonPath

▸ **getPackageJsonPath**(`dirPath`: string): *string | null*

*Defined in [plugins/package/Package.ts:82](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |

**Returns:** *string | null*

___

### `Const` getPackageManager

▸ **getPackageManager**(`dirPath`: string): *[PackageManager](../enums/_plugins_package_package_.packagemanager.md)*

*Defined in [plugins/package/Package.ts:14](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |

**Returns:** *[PackageManager](../enums/_plugins_package_package_.packagemanager.md)*

___

### `Const` hasInstalledPackage

▸ **hasInstalledPackage**(`dirPath`: string, `packageName`: string, `dev`: boolean, `encoding`: string): *boolean*

*Defined in [plugins/package/Package.ts:147](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L147)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dirPath` | string | - |
`packageName` | string | - |
`dev` | boolean | false |
`encoding` | string | "utf8" |

**Returns:** *boolean*

___

### `Const` hasPackageJsonConfig

▸ **hasPackageJsonConfig**(`dirPath`: string, `data`: Object): *boolean*

*Defined in [plugins/package/Package.ts:94](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |
`data` | Object |

**Returns:** *boolean*

___

### `Const` installDevPackages

▸ **installDevPackages**(`dirPath`: string, `devPackages`: string[], `verbose`: boolean): *Promise‹string[]›*

*Defined in [plugins/package/Package.ts:64](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L64)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dirPath` | string | - |
`devPackages` | string[] | [] |
`verbose` | boolean | true |

**Returns:** *Promise‹string[]›*

___

### `Const` installPackages

▸ **installPackages**(`dirPath`: string, `packages`: string[], `verbose`: boolean, `dev`: boolean): *Promise‹string[]›*

*Defined in [plugins/package/Package.ts:25](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L25)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dirPath` | string | - |
`packages` | string[] | [] |
`verbose` | boolean | true |
`dev` | boolean | false |

**Returns:** *Promise‹string[]›*

___

### `Const` updatePackageJson

▸ **updatePackageJson**(`dirPath`: string, `data`: Object): *Promise‹void›*

*Defined in [plugins/package/Package.ts:72](https://github.com/neilime/reactionable-cli/blob/86c13e3/src/plugins/package/Package.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`dirPath` | string |
`data` | Object |

**Returns:** *Promise‹void›*
