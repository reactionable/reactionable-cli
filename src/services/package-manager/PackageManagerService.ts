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

  async getPackageManagerCmd(realpath: string): Promise<string> {
    return (await this.getPackageManager(realpath)).getCmd();
  }

  async execPackageManagerCmd(
    realpath: string,
    cmd: string | string[],
    silent = false
  ): Promise<string> {
    return (await this.getPackageManager(realpath)).execCmd(cmd, silent);
  }

  async isMonorepoPackage(realpath: string): Promise<boolean> {
    return (await this.getPackageManager(realpath)).isMonorepoPackage();
  }

  async installPackages(
    dirPath: string,
    packages: string[] = [],
    verbose = true,
    dev = false
  ): Promise<string[]> {
    const packageManager = await this.getPackageManager(dirPath);

    // Remove already installed packges
    const packagesToInstall: string[] = [];
    for (const packageName of packages) {
      const packageIsInstalled = await this.hasInstalledPackage(dirPath, packageName, dev);
      if (!packageIsInstalled) {
        packagesToInstall.push(packageName);
      }
    }

    if (!packagesToInstall.length) {
      return packagesToInstall;
    }

    verbose && this.consoleService.info(`Installing ${packagesToInstall.join(', ')}...`);

    const installedPackages = await packageManager.installPackages(packagesToInstall, dev);

    verbose &&
      this.consoleService.success(
        installedPackages.length
          ? `Package(s) "${installedPackages.join(', ')}" have been installed`
          : 'no package has been installed'
      );
    return installedPackages;
  }

  async uninstallPackages(
    dirPath: string,
    packages: string[] = [],
    verbose = true
  ): Promise<string[]> {
    const packageManager = await this.getPackageManager(dirPath);

    // Remove already installed packges
    verbose && this.consoleService.info(`Uninstalling ${packages.join(', ')}...`);

    const packagesToUninstall: string[] = [];
    for (const packageName of packages) {
      const packageIsInstalled =
        (await this.hasInstalledPackage(dirPath, packageName)) ||
        (await this.hasInstalledPackage(dirPath, packageName, true));
      if (packageIsInstalled) {
        packagesToUninstall.push(packageName);
      }
    }

    if (!packagesToUninstall.length) {
      return packagesToUninstall;
    }

    const uninstalledPackages = await packageManager.uninstallPackages(packagesToUninstall);

    verbose &&
      this.consoleService.success(
        uninstalledPackages.length
          ? `Package(s) "${uninstalledPackages.join(', ')}" have been uninstalled`
          : 'no package has been uninstalled'
      );
    return uninstalledPackages;
  }

  async hasInstalledPackage(
    dirPath: string,
    packageName: string,
    dev = false,
    encoding: BufferEncoding = 'utf8'
  ): Promise<boolean> {
    const packageManager = await this.getPackageManager(dirPath);
    const installedPackages = packageManager.getPackageJsonData(
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
    const packageManager = await this.getPackageManager(dirPath);

    let packageName = packageManager.getPackageJsonData('name') || basename(dirPath);

    if (fullName) {
      const isMonorepoPackage = await packageManager.isMonorepoPackage();
      if (isMonorepoPackage) {
        const monorepoRootPath = await packageManager.getMonorepoRootPath();
        if (monorepoRootPath) {
          const rootPackageManager = await this.getPackageManager(monorepoRootPath);

          const rootPackageName =
            rootPackageManager.getPackageJsonData('name') || basename(monorepoRootPath);

          packageName = `${rootPackageName} - ${packageName}`;
        }
      }
    }

    return format ? (StringUtils[format] as StringUtilsMethod)(packageName) : packageName;
  }

  async updatePackageJson(dirPath: string, data: Partial<PackageJson>): Promise<void> {
    const packageJsonPath = this.assertPackageJsonExists(dirPath);

    await this.fileFactory.fromFile<JsonFile>(packageJsonPath).appendData(data).saveFile();
  }

  private async getPackageManager(dirPath: string): Promise<IPackageManager> {
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
      this.fileService,
      this.fileFactory,
      realpath,
    ];

    const availablePackageManagers = this.getAvailablePackageManagers();

    for (const packageManagerType of availablePackageManagers) {
      packageManager = undefined;

      switch (packageManagerType) {
        case PackageManagerType.npm:
          packageManager = new NpmPackageManager(...args);
          break;
        case PackageManagerType.yarn:
          packageManager = new YarnPackageManager(...args);
          break;
      }

      const isEnabled = await packageManager.isEnabled();
      if (isEnabled) {
        break;
      }
    }

    if (!packageManager) {
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
