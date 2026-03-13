import { resolve } from "path";

import { PackageManagerType } from "../PackageManagerService";
import { AbstractPackageManager, MonorepoInfo } from "./AbstractPackageManager";

export class NpmPackageManager extends AbstractPackageManager {
  protected type = PackageManagerType.npm;

  async isEnabled(): Promise<boolean> {
    if (await this.fileService.fileExists(resolve(this.realpath, "package-lock.json"))) {
      return true;
    }
    return this.isMonorepoPackage();
  }

  async installPackages(packages: string[], dev: boolean): Promise<string[]> {
    const args = ["install", ...packages];
    if (dev) {
      args.push("-D");
    }
    await this.execCmd(args);
    return packages;
  }

  async uninstallPackages(packages: string[]): Promise<string[]> {
    const args = ["uninstall", ...packages];
    await this.execCmd(args);
    return packages;
  }

  protected async getMonorepoInfos(): Promise<MonorepoInfo | undefined> {
    try {
      const rootDirectory = (await this.execCmd(["prefix"], true)).trim();
      if (!rootDirectory) {
        return undefined;
      }

      return { rootDirectory };
    } catch {
      return undefined;
    }
  }
}
