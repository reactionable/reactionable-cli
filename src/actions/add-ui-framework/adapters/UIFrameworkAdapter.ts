import { resolve } from "path";

import { LazyServiceIdentifer, inject, injectable } from "inversify";

import { ConsoleService } from "../../../services/ConsoleService";
import { FileFactory } from "../../../services/file/FileFactory";
import { TypescriptFile } from "../../../services/file/TypescriptFile";
import { PackageManagerService } from "../../../services/package-manager/PackageManagerService";
import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from "../../AbstractAdapterWithPackageAction";
import CreateApp from "../../create-app/CreateApp";

export type UIFrameworkAdapter<
  O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions,
> = AbstractAdapterWithPackageAction<O>;

@injectable()
export abstract class AbstractUIFrameworkAdapter
  extends AbstractAdapterWithPackageAction
  implements UIFrameworkAdapter
{
  constructor(
    @inject(PackageManagerService)
    packageManagerService: PackageManagerService,
    @inject(FileFactory) protected readonly fileFactory: FileFactory,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(new LazyServiceIdentifer(() => CreateApp)) protected readonly createApp: CreateApp
  ) {
    super(packageManagerService);
  }

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Add UI components to existing App components
    this.consoleService.info("Add UI components to existing components...");
    const appFile = await this.getAppFilePath(realpath);
    await this.fileFactory
      .fromFile<TypescriptFile>(appFile)
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
      .replaceContent(/ui: undefined,.*$/m, "ui: useUIContextProviderProps(),")
      .saveFile();

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
