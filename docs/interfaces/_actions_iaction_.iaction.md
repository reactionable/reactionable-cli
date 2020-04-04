[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/IAction"](../modules/_actions_iaction_.md) › [IAction](_actions_iaction_.iaction.md)

# Interface: IAction <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

  ↳ [IRealpathRunnable](_actions_irealpathrunnable_.irealpathrunnable.md)‹O›

  ↳ **IAction**

## Implemented by

* [CreateComponent](../classes/_actions_create_component_createcomponent_.createcomponent.md)
* [CreateCrudComponent](../classes/_actions_create_component_createcrudcomponent_.createcrudcomponent.md)
* [CreateReactApp](../classes/_actions_create_react_app_createreactapp_.createreactapp.md)
* [GenerateFavicons](../classes/_actions_generate_favicons_generatefavicons_.generatefavicons.md)
* [GenerateReadme](../classes/_actions_generate_readme_generatereadme_.generatereadme.md)

## Index

### Properties

* [getName](_actions_iaction_.iaction.md#getname)
* [run](_actions_iaction_.iaction.md#run)

## Properties

###  getName

• **getName**: *function*

*Defined in [actions/IAction.ts:5](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IAction.ts#L5)*

#### Type declaration:

▸ (): *string*

___

###  run

• **run**: *function*

*Inherited from [IRunnable](_actions_irunnable_.irunnable.md).[run](_actions_irunnable_.irunnable.md#run)*

*Defined in [actions/IRunnable.ts:4](https://github.com/neilime/reactionable-cli/blob/d0401b5/src/actions/IRunnable.ts#L4)*

#### Type declaration:

▸ (`options`: [IRealpathRunnableOptions](_actions_irealpathrunnable_.irealpathrunnableoptions.md) & O): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IRealpathRunnableOptions](_actions_irealpathrunnable_.irealpathrunnableoptions.md) & O |
