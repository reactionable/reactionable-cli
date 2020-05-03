import { AbstractPackageManager, MonorepoInfo } from './AbstractPackageManager';
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

  protected getMonorepoInfos(): Promise<MonorepoInfo | undefined> {
    throw new Error('Method not implemented.');
  }
}
