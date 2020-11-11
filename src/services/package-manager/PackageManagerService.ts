import { basename, resolve } from 'path';

import { inject, injectable } from 'inversify';
import { which } from 'shelljs';

import { CliService } from '../CliService';
import { ConsoleService } from '../ConsoleService';
import { FileFactory } from '../file/FileFactory';
import { FileService } from '../file/FileService';
import { JsonFile, JsonFileData } from '../file/JsonFile';
import { StringUtils, StringUtilsMethod, StringUtilsMethods } from '../StringUtils';
import { AbstractPackageManager } from './adapters/AbstractPackageManager';
import { IPackageManager, PackageJson } from './adapters/IPackageManager';
import { NpmPackageManager } from './adapters/NpmPackageManager';
import { YarnPackageManager } from './adapters/YarnPackageManager';

export enum PackageManagerType {
  yarn = 'yarn',
  npm = 'npm',
}

type AbstractConstructorHelper<T> = (new (...args: unknown[]) => {
  [x: string]: unknown;
}) &
  T;
type AbstractContructorParameters<T> = ConstructorParameters<AbstractConstructorHelper<T>>;

@injectable()
export class PackageManagerService {
  private readonly packageManagers: Map<string, IPackageManager> = new Map();

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(CliService) private readonly cliService: CliService
  ) {}

  /**
   * Retrieve all package manager types available for this runtime
   */
  getAvailablePackageManagers = (): PackageManagerType[] => {
    const packageManagers: PackageManagerType[] = [];
    for (const packageManager in PackageManagerType) {
      if (which(packageManager)) {
        packageManagers.push(packageManager as PackageManagerType);
      }
    }
    return packageManagers;
  };

  getPackageManagerCmd(realpath: string): string {
    return this.getPackageManager(realpath).getCmd();
  }

  isMonorepoPackage(realpath: string): Promise<boolean> {
    return this.getPackageManager(realpath).isMonorepoPackage();
  }

  getNodeModulesDirPath(realpath: string): Promise<string> {
    return this.getPackageManager(realpath).getNodeModulesDirPath();
  }

  async installPackages(
    dirPath: string,
    packages: string[] = [],
    verbose = true,
    dev = false
  ): Promise<string[]> {
    const packageManager = this.getPackageManager(dirPath);

    // Remove already installed packges
    packages = packages.filter(
      (packageName) => !this.hasInstalledPackage(dirPath, packageName, dev)
    );

    if (!packages.length) {
      return packages;
    }

    verbose && this.consoleService.info(`Installing ${packages.join(', ')}...`);

    const installedPackages = await packageManager.installPackages(packages, dev);

    verbose &&
      this.consoleService.success(
        installedPackages.length
          ? `Package(s) "${installedPackages.join(', ')}" have been installed`
          : 'no package has been installed'
      );
    return packages;
  }

  hasInstalledPackage(
    dirPath: string,
    packageName: string,
    dev = false,
    encoding: BufferEncoding = 'utf8'
  ): boolean {
    const installedPackages = this.getPackageManager(dirPath).getPackageJsonData(
      dev ? 'devDependencies' : 'dependencies',
      encoding
    );

    return !!(installedPackages && installedPackages[packageName]);
  }

  hasPackageJson(dirPath: string): boolean {
    return !!this.getPackageJsonPath(dirPath);
  }

  async getPackageName(
    dirPath: string,
    format?: StringUtilsMethods,
    fullName = true
  ): Promise<string> {
    const packageManager = this.getPackageManager(dirPath);

    let packageName = packageManager.getPackageJsonData('name') || basename(dirPath);

    if (fullName) {
      const isMonorepoPackage = await packageManager.isMonorepoPackage();
      if (isMonorepoPackage) {
        const monorepoRootPath = await packageManager.getMonorepoRootPath();
        if (monorepoRootPath) {
          const rootPackageManager = this.getPackageManager(monorepoRootPath);

          const rootPackageName =
            rootPackageManager.getPackageJsonData('name') || basename(monorepoRootPath);

          packageName = `${rootPackageName} - ${packageName}`;
        }
      }
    }

    return format ? (StringUtils[format] as StringUtilsMethod)(packageName) : packageName;
  }

  hasPackageJsonConfig(dirPath: string, data: Partial<PackageJson>): boolean {
    const compareObject = (data: Partial<PackageJson>, packageJson: PackageJson) => {
      for (const key of Object.keys(data)) {
        const dataValue = data[key];
        const packageJsonValue = packageJson[key];
        if (!packageJsonValue) {
          return false;
        }

        const typeofData = typeof dataValue;
        const typeofPackageInfo = typeof packageJsonValue;
        if (typeofData !== typeofPackageInfo) {
          return false;
        }

        switch (typeofData) {
          case 'object':
            if (Array.isArray(dataValue)) {
              if (!Array.isArray(packageJsonValue)) {
                return false;
              }

              if (
                !(dataValue as unknown[]).every((item) =>
                  (packageJsonValue as unknown[]).includes(item)
                )
              ) {
                return false;
              }
            } else {
              if (Array.isArray(packageJsonValue)) {
                return false;
              }
              if (!compareObject(dataValue as JsonFileData, packageJsonValue as JsonFileData)) {
                return false;
              }
            }
            break;
          default:
            if (dataValue !== packageJsonValue) {
              return false;
            }
        }
      }
      return true;
    };

    return compareObject(data, this.getPackageManager(dirPath).getPackageJsonData());
  }

  async updatePackageJson(dirPath: string, data: Partial<PackageJson>): Promise<void> {
    const packageJsonPath = this.assertPackageJsonExists(dirPath);

    await this.fileFactory.fromFile<JsonFile>(packageJsonPath).appendData(data).saveFile();
  }

  private getPackageManager(dirPath: string): IPackageManager {
    let packageManager = this.packageManagers.get(dirPath);
    if (packageManager) {
      return packageManager;
    }

    const realpath = this.fileService.assertDirExists(dirPath);
    packageManager = this.packageManagers.get(realpath);
    if (packageManager) {
      return packageManager;
    }

    const args: AbstractContructorParameters<typeof AbstractPackageManager> = [
      this.cliService,
      this.fileFactory,
      realpath,
    ];

    switch (true) {
      case this.fileService.fileExistsSync(resolve(dirPath, 'yarn.lock')):
        packageManager = new YarnPackageManager(...args);
        break;

      case this.fileService.fileExistsSync(resolve(dirPath, 'package-lock.json')):
        packageManager = new NpmPackageManager(...args);
        break;

      default:
        throw new Error(`No package manager found for directory ${realpath}`);
    }

    this.packageManagers.set(dirPath, packageManager);
    this.packageManagers.set(realpath, packageManager);
    return packageManager;
  }

  private getPackageJsonPath(dirPath: string): string | null {
    const packageJsonPath = resolve(dirPath, 'package.json');

    if (this.fileService.fileExistsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    return null;
  }

  private assertPackageJsonExists(dirPath: string): string {
    const packageJsonPath = this.getPackageJsonPath(dirPath);
    if (!packageJsonPath) {
      throw new Error(`package.json does not exist in directory "${dirPath}"`);
    }
    return packageJsonPath;
  }
}
