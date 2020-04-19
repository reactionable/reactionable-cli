import { AbstractPackageManager } from './AbstractPackageManager';
import { PackageManagerType } from '../PackageManagerService';

export class NpmPackageManager extends AbstractPackageManager {
  protected type = PackageManagerType.npm;

  async installPackages(packages: string[], dev: boolean): Promise<string[]> {
    const args = ['install', ...packages];
    if (dev) {
      args.push('-D');
    }
    await this.execCmd(args);
    return packages;
  }

  isMonorepo(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
