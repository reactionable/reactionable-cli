import { resolve } from "path";

import { PackageManagerType } from "../PackageManagerService";
import { AbstractPackageManager } from "./AbstractPackageManager";
import { PackageJson } from "./IPackageManager";

export interface YarnPackageJson extends PackageJson {
  workspaces?: string[];
}

export interface MonorepoInfos {
  rootDirectory: string;
}

export class YarnPackageManager extends AbstractPackageManager<YarnPackageJson> {
  protected type = PackageManagerType.yarn;

  async isEnabled(): Promise<boolean> {
    if (await this.fileService.fileExists(resolve(this.realpath, "yarn.lock"))) {
      return true;
    }
    return this.isMonorepoPackage();
  }

  async installPackages(packages: string[], dev: boolean): Promise<string[]> {
    const args = ["add", ...packages];
    if (dev) {
      args.push("--dev");
    }
    await this.execCmd(args);
    return packages;
  }

  async uninstallPackages(packages: string[]): Promise<string[]> {
    const args = ["remove", ...packages];
    await this.execCmd(args);
    return packages;
  }

  protected async getMonorepoInfos(): Promise<MonorepoInfos | undefined> {
    const workspacesRootData = await this.getPackageJsonData("workspaces");
    if (workspacesRootData) {
      return {
        rootDirectory: this.realpath,
      };
    }

    try {
      const result = await this.execCmd(["workspaces", "--json", "info"], true);
      if (!result) {
        return undefined;
      }
      const workspacesData = JSON.parse(JSON.parse(result).data);

      for (const workspace of Object.keys(workspacesData)) {
        const { location } = workspacesData[workspace];

        const matches = new RegExp(`(.+)${location}$`).exec(this.realpath);
        if (matches) {
          return { rootDirectory: matches[1] };
        }
      }

      return undefined;
    } catch (error) {
      if (`${error}`.indexOf("Cannot find the root of your workspace") !== -1) {
        return undefined;
      }
      throw error;
    }
  }
}
