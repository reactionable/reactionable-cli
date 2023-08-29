import { resolve } from "path";

import { PackageManagerType } from "../PackageManagerService";
import { AbstractPackageManager, MonorepoInfo } from "./AbstractPackageManager";

export class NpmPackageManager extends AbstractPackageManager {
  protected type = PackageManagerType.npm;

  async isEnabled(): Promise<boolean> {
    return this.fileService.fileExistsSync(resolve(this.realpath, "package-lock.json"));
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

  protected getMonorepoInfos(): Promise<MonorepoInfo | undefined> {
    throw new Error("Method not implemented.");
  }
}
