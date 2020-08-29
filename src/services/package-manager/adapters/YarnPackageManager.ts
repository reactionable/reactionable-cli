import { realpathSync } from 'fs';

import { PackageManagerType } from '../PackageManagerService';
import { AbstractPackageManager } from './AbstractPackageManager';
import { PackageJson } from './IPackageManager';

export interface YarnPackageJson extends PackageJson {
  workspaces?: string[];
}

export class YarnPackageManager extends AbstractPackageManager<YarnPackageJson> {
  protected type = PackageManagerType.yarn;

  async installPackages(packages: string[], dev: boolean): Promise<string[]> {
    const args = ['add', ...packages];
    if (dev) {
      args.push('--dev');
    }
    await this.execCmd(args);
    return packages;
  }

  protected async getMonorepoInfos() {
    const workspacesRootData = this.getPackageJsonData('workspaces');
    if (workspacesRootData) {
      return {
        rootDirectory: this.realpath,
      };
    }

    try {
      const result = await this.execCmd(['workspaces', '--json', 'info'], true);
      if (!result) {
        return undefined;
      }
      const workspacesData = JSON.parse(JSON.parse(result).data);

      for (const workspace of Object.keys(workspacesData)) {
        const { location } = workspacesData[workspace];

        const matches = new RegExp(`(.+)${location}$`).exec(this.realpath);
        if (matches) {
          return { rootDirectory: realpathSync(matches[1]) };
        }
      }

      return undefined;
    } catch (error) {
      if (error.toString().indexOf('Cannot find the root of your workspace') !== -1) {
        return undefined;
      }
      throw error;
    }
  }
}
