[@reactionable/cli](../README.md) › [Globals](../globals.md) › ["actions/IRealpathRunnable"](../modules/_actions_irealpathrunnable_.md) › [IRealpathRunnable](_actions_irealpathrunnable_.irealpathrunnable.md)

# Interface: IRealpathRunnable <**O**>

## Type parameters

▪ **O**: *[IOptions](../modules/_actions_irunnable_.md#ioptions)*

## Hierarchy

* [IRunnable](_actions_irunnable_.irunnable.md)‹[IRealpathRunnableOptions](_actions_irealpathrunnable_.irealpathrunnableoptions.md) & O›

  ↳ **IRealpathRunnable**

  ↳ [IAction](_actions_iaction_.iaction.md)

  ↳ [IAdapter](_actions_iadapter_.iadapter.md)

## Implemented by

* [AbstractActionWithAdapters](../classes/_actions_abstractactionwithadapters_.abstractactionwithadapters.md)
* [AbstractAdapter](../classes/_actions_abstractadapter_.abstractadapter.md)
* [AbstractAdapterWithPackage](../classes/_actions_abstractadapterwithpackage_.abstractadapterwithpackage.md)
* [AbstractCommitableActionWithAdapters](../classes/_actions_abstractcommitableactionwithadapters_.abstractcommitableactionwithadapters.md)
* [AbstractVersioning](../classes/_actions_add_versioning_adapters_abstractversioning_.abstractversioning.md)
* [AddHosting](../classes/_actions_add_hosting_addhosting_.addhosting.md)
* [AddUIFramework](../classes/_actions_add_ui_framework_adduiframework_.adduiframework.md)
* [AddVersioning](../classes/_actions_add_versioning_addversioning_.addversioning.md)
* [Amplify](../classes/_actions_add_hosting_adapters_amplify_amplify_.amplify.md)
* [Git](../classes/_actions_add_versioning_adapters_github_github_.git.md)
* [Netlify](../classes/_actions_add_hosting_adapters_netlify_netlify_.netlify.md)
* [ReactBootstrap](../classes/_actions_add_ui_framework_adapters_reactbootstrap_.reactbootstrap.md)

## Index

### Properties

* [run](_actions_irealpathrunnable_.irealpathrunnable.md#run)

## Properties

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
