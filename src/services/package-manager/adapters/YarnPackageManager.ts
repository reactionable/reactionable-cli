import { AbstractPackageManager } from './AbstractPackageManager';
import { PackageManagerType } from '../PackageManagerService';

export class YarnPackageManager extends AbstractPackageManager {
  protected type = PackageManagerType.yarn;

  async installPackages(packages: string[], dev: boolean): Promise<string[]> {
    const args = ['add', ...packages];
    if (dev) {
      args.push('--dev');
    }
    await this.execCmd(args);
    return packages;
  }

  async isMonorepo(): Promise<boolean> {
    try {
      await this.execCmd(['workspaces', 'info'], true);
      return true;
    } catch (error) {
      if (
        error.toString().indexOf('Cannot find the root of your workspace') !==
        -1
      ) {
        return false;
      }
      throw error;
    }
  }
}
