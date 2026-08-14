import { resolve } from "node:path";
import { inject, LazyServiceIdentifier } from "inversify";

import { ConsoleService } from "../../../services/ConsoleService";
import { FileFactory } from "../../../services/file/FileFactory";
import type { TypescriptFile } from "../../../services/file/TypescriptFile";
import { PackageManagerService } from "../../../services/package-manager/PackageManagerService";
import {
	AbstractAdapterWithPackageAction,
	type AdapterWithPackageActionOptions,
} from "../../AbstractAdapterWithPackageAction";
import { CreateAppIdentifier } from "../../container";
import type CreateApp from "../../create-app/CreateApp";

export type UIFrameworkAdapter<
	O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions,
> = AbstractAdapterWithPackageAction<O>;

export abstract class AbstractUIFrameworkAdapter
	extends AbstractAdapterWithPackageAction
	implements UIFrameworkAdapter
{
	constructor(
		@inject(PackageManagerService)
		packageManagerService: PackageManagerService,
		@inject(FileFactory) protected readonly _fileFactory: FileFactory,
		@inject(ConsoleService) protected readonly _consoleService: ConsoleService,
		@inject(new LazyServiceIdentifier(() => CreateAppIdentifier))
		protected readonly _createApp: CreateApp,
	) {
		super(packageManagerService);
	}

	get fileFactory(): FileFactory {
		return this._fileFactory;
	}

	get consoleService(): ConsoleService {
		return this._consoleService;
	}

	get createApp(): CreateApp {
		return this._createApp;
	}

	async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
		await super.run({ realpath });

		// Add UI components to existing App components
		this.consoleService.info("Add UI components to existing components...");
		const appFilePath = await this.getAppFilePath(realpath);
		const appFile =
			await this.fileFactory.fromFile<TypescriptFile>(appFilePath);
		appFile
			.setImports(
				[
					{
						packageName: this.getAdapterPackageName(),
						modules: {
							IAppProps: "",
							useUIContextProviderProps: "",
						},
					},
				],
				[
					{
						packageName: "@reactionable/core",
						modules: {
							IUIContextProviderProps: "",
							IAppProps: "",
						},
					},
				],
			)
			.replaceContent(/ui: undefined,.*$/m, "ui: useUIContextProviderProps(),");
		await appFile.saveFile();

		this.consoleService.success(
			"UI components have been added to existing components",
		);
	}

	protected async getAppFilePath(realpath: string): Promise<string> {
		const adapter = await this.createApp.detectAdapter(realpath);
		if (!adapter) {
			throw new Error(`Unable to detect app type for given path "${realpath}"`);
		}
		return resolve(realpath, adapter.getAppFilePath());
	}
}
