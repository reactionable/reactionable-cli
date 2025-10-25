import { resolve } from "path";

import { inject } from "inversify";
import shelljs from "shelljs";

const { which } = shelljs;


import { CliService } from "../../CliService";
import { FileFactory } from "../../file/FileFactory";
import { FileService } from "../../file/FileService";
import { JsonFile } from "../../file/JsonFile";
import { PackageManagerType } from "../PackageManagerService";
import { IPackageManager, PackageJson } from "./IPackageManager";

export interface MonorepoInfo {
  rootDirectory: string;
}

export abstract class AbstractPackageManager<PJ extends PackageJson = PackageJson>
  implements IPackageManager<PJ>
{
  protected abstract type: PackageManagerType;

  constructor(
    @inject(CliService) protected readonly cliService: CliService,
    @inject(FileService) protected readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    protected realpath: string
  ) {}

  abstract isEnabled(): Promise<boolean>;
  abstract installPackages(packages: string[], dev: boolean): Promise<string[]>;
  abstract uninstallPackages(packages: string[]): Promise<string[]>;

  getCmd(): string {
    return this.type;
  }

  getPackageJsonData(): Promise<PJ>;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P,
    encoding?: BufferEncoding
  ): Promise<PJ[P] | undefined>;
  async getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P | undefined = undefined,
    encoding: BufferEncoding = "utf8"
  ): Promise<PackageJson | PJ[P] | undefined> {
    const packageJsonPath = resolve(this.realpath, "package.json");

    const file = await this.fileFactory.fromFile<JsonFile>(packageJsonPath, encoding);

    if (property) {
      return file.getData<PJ>(property) as PJ[P] | undefined;
    }

    return file.getData<PJ>() || undefined;
  }

  async getNodeModulesDirPath(): Promise<string> {
    const result = await this.execCmd("bin", true);
    return resolve(result.trim(), "..");
  }

  execCmd(cmd: string | string[], silent = false): Promise<string> {
    if (!which(`${this.type}`)) {
      throw new Error(
        `Unable to execute command "${Array.from(cmd).join(" ")}", please install "${this.type}"`
      );
    }

    return this.cliService.execCmd(
      [this.type, ...(Array.isArray(cmd) ? cmd : [cmd])],
      this.realpath,
      silent
    );
  }

  async isMonorepoPackage(): Promise<boolean> {
    const monorepoInfo = await this.getMonorepoInfos();
    if (!monorepoInfo) {
      return false;
    }
    return monorepoInfo.rootDirectory !== this.realpath;
  }

  async getMonorepoRootPath(): Promise<string | undefined> {
    const monorepoInfo = await this.getMonorepoInfos();
    return monorepoInfo?.rootDirectory;
  }

  protected abstract getMonorepoInfos(): Promise<MonorepoInfo | undefined>;

  protected installDevPackages(devPackages: string[]): Promise<string[]> {
    return this.installPackages(devPackages, true);
  }
}
