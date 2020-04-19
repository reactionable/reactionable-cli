import { injectable, inject } from 'inversify';

import { PackageManagerService } from '../services/package-manager/PackageManagerService';
import { AbstractAdapter } from './AbstractAdapter';
import { IOptions } from './IRunnable';

@injectable()
export abstract class AbstractAdapterWithPackage<
  O extends IOptions = {}
> extends AbstractAdapter<O> {
  protected abstract packageName: string;

  constructor(
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService
  ) {
    super();
  }

  getPackageName(): string {
    return this.packageName;
  }

  async isEnabled(realpath: string): Promise<boolean> {
    return this.packageManagerService.hasInstalledPackage(
      realpath,
      this.getPackageName()
    );
  }

  async run({ realpath }) {
    // Installs package
    await this.packageManagerService.installPackages(realpath, [
      this.getPackageName(),
    ]);
  }
}
