import { resolve } from "path";
import { createRequire } from "module";

import { LazyServiceIdentifier, inject } from "inversify";

import { ConsoleService } from "../../../services/ConsoleService";
import { FileFactory } from "../../../services/file/FileFactory";
import { TypescriptFile } from "../../../services/file/TypescriptFile";
import { PackageManagerService } from "../../../services/package-manager/PackageManagerService";
import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from "../../AbstractAdapterWithPackageAction";
import type CreateApp from "../../create-app/CreateApp";

// Use CommonJS require to load CreateApp to avoid ESM circular dependency issues
const require = createRequire(import.meta.url);

// Lazy getter function to avoid circular dependency with CreateApp in ESM
let _CreateApp: typeof CreateApp | null = null;
function getCreateApp(): typeof CreateApp {
  if (!_CreateApp) {
    // Load using CommonJS require which handles circular dependencies better
    const loaded = require("../../create-app/CreateApp");
    _CreateApp = loaded.default || loaded;
  }
  return _CreateApp as typeof CreateApp;
}

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
    @inject(FileFactory) protected readonly fileFactory: FileFactory,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(new LazyServiceIdentifier(() => getCreateApp())) protected readonly createApp: CreateApp
  ) {
    super(packageManagerService);
  }

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Add UI components to existing App components
    this.consoleService.info("Add UI components to existing components...");
    const appFilePath = await this.getAppFilePath(realpath);
    const appFile = await this.fileFactory.fromFile<TypescriptFile>(appFilePath);
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
        ]
      )
      .replaceContent(/ui: undefined,.*$/m, "ui: useUIContextProviderProps(),");
    await appFile.saveFile();

    this.consoleService.success("UI components have been added to existing components");
  }

  protected async getAppFilePath(realpath: string): Promise<string> {
    const adapter = await this.createApp.detectAdapter(realpath);
    if (!adapter) {
      throw new Error(`Unable to detect app type for given path "${realpath}"`);
    }
    return resolve(realpath, adapter.getAppFilePath());
  }
}
