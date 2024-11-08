import { inject } from "inversify";

import { PackageManagerService } from "../services/package-manager/PackageManagerService";
import { AbstractAdapterAction, AdapterActionOptions } from "./AbstractAdapterAction";

export type AdapterWithPackageActionOptions = AdapterActionOptions;

export abstract class AbstractAdapterWithPackageAction<
  O extends AdapterWithPackageActionOptions = AdapterWithPackageActionOptions,
> extends AbstractAdapterAction<O> {
  protected abstract adapterPackageName: string;

  constructor(
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService
  ) {
    super();
  }

  getAdapterPackageName(): string {
    return this.adapterPackageName;
  }

  async isEnabled(realpath: string): Promise<boolean> {
    return this.packageManagerService.hasInstalledPackage(realpath, this.getAdapterPackageName());
  }

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await this.packageManagerService.installPackages(realpath, [this.getAdapterPackageName()]);
  }
}
