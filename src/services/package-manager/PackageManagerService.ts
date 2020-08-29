import { basename, resolve } from 'path';

import { inject, injectable } from 'inversify';
import { which } from 'shelljs';

import { CliService } from '../CliService';
import { ConsoleService } from '../ConsoleService';
import { FileFactory } from '../file/FileFactory';
import { FileService } from '../file/FileService';
import { JsonFile } from '../file/JsonFile';
import { StringUtils, StringUtilsMethod, StringUtilsMethods } from '../StringUtils';
import { AbstractPackageManager } from './adapters/AbstractPackageManager';
import { IPackageManager, PackageJson } from './adapters/IPackageManager';
import { NpmPackageManager } from './adapters/NpmPackageManager';
import { YarnPackageManager } from './adapters/YarnPackageManager';

export enum PackageManagerType {
  yarn = 'yarn',
  npm = 'npm',
}

type AbstractConstructorHelper<T> = (new (...args: any) => {
  [x: string]: any;
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
    for (let packageManager in PackageManagerType) {
      if (which(packageManager)) {
        packageManagers.push(packageManager as PackageManagerType);
      }
    }
    return packageManagers;
  };

  getPackageManagerCmd(realpath: any) {
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
    verbose: boolean = true,
    dev: boolean = false
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
    dev: boolean = false,
    encoding: BufferEncoding = 'utf8'
  ): boolean {
    const installedPackages = this.getPackageManager(dirPath).getPackageJsonData(
      dev ? 'devDependencies' : 'dependencies',
      encoding
    );

    return !!(installedPackages && installedPackages[packageName]);
  }

  hasPackageJson(dirPath: string) {
    return !!this.getPackageJsonPath(dirPath);
  }

  async getPackageName(
    dirPath: string,
    format?: StringUtilsMethods,
    fullName: boolean = true
  ): Promise<string> {
    const packageManager = this.getPackageManager(dirPath);

    let packageName = packageManager.getPackageJsonData('name') || basename(dirPath);

    if (fullName) {
      const isMonorepoPackage = await packageManager.isMonorepoPackage();
      if (isMonorepoPackage) {
        const monorepoRootPath = await packageManager.getMonorepoRootPath();
        if (monorepoRootPath) {
          const rootPackageManager = this.getPackageManager(monorepoRootPath);

          let rootPackageName =
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
        if (!packageJson[key]) {
          return false;
        }
        const typeofData = typeof data[key];
        const typeofPackageInfo = typeof packageJson[key];
        if (typeofData !== typeofPackageInfo) {
          return false;
        }
        switch (typeofData) {
          case 'object':
            if (Array.isArray(data[key])) {
              if (!Array.isArray(packageJson[key])) {
                return false;
              }

              if (!data[key].every((item) => packageJson[key].contains(item))) {
                return false;
              }
            } else {
              if (Array.isArray(packageJson[key])) {
                return false;
              }
              if (!compareObject(data[key], packageJson[key])) {
                return false;
              }
            }
            break;
          default:
            if (data[key] !== packageJson[key]) {
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

    let realpath = this.fileService.assertDirExists(dirPath);
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
