import { inject, injectable } from 'inversify';

import { PackageManagerService } from '../services/package-manager/PackageManagerService';
import { AbstractAdapter } from './AbstractAdapter';
import { IOptions } from './IRunnable';

@injectable()
export abstract class AbstractAdapterWithPackage<O extends IOptions = {}> extends AbstractAdapter<
  O
> {
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

  async run({ realpath }) {
    // Installs package
    await this.packageManagerService.installPackages(realpath, [this.getAdapterPackageName()]);
  }
}
