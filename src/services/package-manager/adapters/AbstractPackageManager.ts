import { IPackageManager, PackageJson } from './IPackageManager';
import { which } from 'shelljs';
import { resolve } from 'path';
import { inject } from 'inversify';
import { PackageManagerType } from '../PackageManagerService';
import { CliService } from '../../CliService';
import { FileFactory } from '../../file/FileFactory';
import { JsonFile } from '../../file/JsonFile';

export interface MonorepoInfo {
  rootDirectory: string;
}

export abstract class AbstractPackageManager<
  PJ extends PackageJson = PackageJson
> implements IPackageManager<PJ> {
  protected abstract type: PackageManagerType;

  constructor(
    @inject(CliService) protected readonly cliService: CliService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    protected realpath: string
  ) {}

  getCmd(): string {
    return this.type;
  }

  getPackageJsonData(): PJ;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P,
    encoding?: BufferEncoding
  ): PJ[P] | undefined;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P | undefined = undefined,
    encoding: BufferEncoding = 'utf8'
  ): PackageJson | PJ[P] | undefined {
    const packageJsonPath = resolve(this.realpath, 'package.json');

    const file = this.fileFactory.fromFile<JsonFile>(packageJsonPath, encoding);

    if (property) {
      return file.getData<PJ>(property) as PJ[P] | undefined;
    }

    return file.getData<PJ>()!;
  }

  async getNodeModulesDirPath(): Promise<string> {
    const result = await this.execCmd('bin', true);
    return resolve(result.trim(), '..');
  }

  abstract installPackages(packages: string[], dev: boolean): Promise<string[]>;

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

  protected execCmd(
    cmd: string | string[],
    silent: boolean = false
  ): Promise<string> {
    if (!which(`${this.type}`)) {
      throw new Error(
        `Unable to execute command, please install "${this.type}"`
      );
    }

    return this.cliService.execCmd(
      [this.type, ...(Array.isArray(cmd) ? cmd : [cmd])],
      this.realpath,
      silent
    );
  }
}
