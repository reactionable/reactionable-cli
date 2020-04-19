import { which } from 'shelljs';
import { resolve } from 'path';
import { injectable, inject } from 'inversify';
import { FileService } from '../file/FileService';
import { ConsoleService } from '../ConsoleService';
import { YarnPackageManager } from './adapters/YarnPackageManager';
import { NpmPackageManager } from './adapters/NpmPackageManager';
import { IPackageManager } from './adapters/IPackageManager';
import { FileFactory } from '../file/FileFactory';
import { JsonFile } from '../file/JsonFile';

export enum PackageManagerType {
  yarn = 'yarn',
  npm = 'npm',
}

export type PackageJsonDependencies = {
  [key: string]: string;
};

export type PackageJson = {
  name?: string;
  version?: string;
  author?: {
    name?: string;
  };
  bugs?: {
    url?: string;
  };
  repository?: {
    type?: string;
    url?: string;
  };
  devDependencies?: PackageJsonDependencies;
  dependencies?: PackageJsonDependencies;
  husky?: {
    hooks?: {
      'commit-msg'?: string;
    };
  };
  config?: {
    commitizen?: {
      path?: string;
    };
  };
};

@injectable()
export class PackageManagerService {
  private readonly packageManagers: Map<string, IPackageManager> = new Map();

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(ConsoleService) private readonly consoleService: ConsoleService
  ) {}

  isMonorepo(realpath: string): Promise<boolean> {
    return this.getPackageManager(realpath).isMonorepo();
  }

  getNodeModulesDirPath(realpath: string): Promise<string> {
    return this.getPackageManager(realpath).getNodeModulesDirPath();
  }

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

  getPackageManager(dirPath: string): IPackageManager {
    let packageManager = this.packageManagers.get(dirPath);
    if (packageManager) {
      return packageManager;
    }

    let realpath = this.fileService.assertDirExists(dirPath);
    packageManager = this.packageManagers.get(dirPath);
    if (packageManager) {
      return packageManager;
    }

    const args = [this.fileService, this.fileFactory, realpath];

    switch (true) {
      case this.fileService.fileExistsSync(resolve(dirPath, 'yarn.lock')):
        packageManager = new YarnPackageManager(
          ...(args as ConstructorParameters<typeof YarnPackageManager>)
        );
        break;
      case this.fileService.fileExistsSync(
        resolve(dirPath, 'package-lock.json')
      ):
        packageManager = new NpmPackageManager(
          ...(args as ConstructorParameters<typeof NpmPackageManager>)
        );
        break;
      default:
        throw new Error(`No package manager found for directory ${realpath}`);
    }

    this.packageManagers.set(dirPath, packageManager);
    return packageManager;
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

    const installedPackages = await packageManager.installPackages(
      packages,
      dev
    );

    verbose &&
      this.consoleService.success(
        installedPackages.length
          ? 'Package(s) "' +
              installedPackages.join(', ') +
              '" have been installed'
          : 'no package has been installed'
      );
    return packages;
  }

  hasInstalledPackage(
    dirPath: string,
    packageName: string,
    dev: boolean = false,
    encoding = 'utf8'
  ): boolean {
    const installedPackages = this.getPackageJsonData(
      dirPath,
      dev ? 'devDependencies' : 'dependencies',
      encoding
    );

    return !!(installedPackages && installedPackages[packageName]);
  }

  hasPackageJson(dirPath: string) {
    return !!this.getPackageJsonPath(dirPath);
  }

  getPackageJsonData(dirPath: string): PackageJson;
  getPackageJsonData<P extends keyof PackageJson = keyof PackageJson>(
    dirPath: string,
    property: P,
    encoding?: string
  ): PackageJson[P] | undefined;
  getPackageJsonData<P extends keyof PackageJson = keyof PackageJson>(
    dirPath: string,
    property: P | undefined = undefined,
    encoding: string = 'utf8'
  ): PackageJson | PackageJson[P] | undefined {
    const packageJsonPath = this.assertPackageJsonExists(dirPath);

    const file = this.fileFactory.fromFile<JsonFile>(packageJsonPath, encoding);

    if (property) {
      return file.getData<PackageJson>(property) as PackageJson[P] | undefined;
    }

    return file.getData<PackageJson>()!;
  }

  async updatePackageJson(
    dirPath: string,
    data: Partial<PackageJson>
  ): Promise<void> {
    const packageJsonPath = this.assertPackageJsonExists(dirPath);

    await this.fileFactory
      .fromFile<JsonFile>(packageJsonPath)
      .appendData(data)
      .saveFile();
  }

  hasPackageJsonConfig(dirPath: string, data: Partial<PackageJson>): boolean {
    const compareObject = (
      data: Partial<PackageJson>,
      packageJson: PackageJson
    ) => {
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

    return compareObject(data, this.getPackageJsonData(dirPath));
  }

  protected getPackageJsonPath(dirPath: string): string | null {
    const packageJsonPath = resolve(dirPath, 'package.json');

    if (this.fileService.fileExistsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    return null;
  }

  protected assertPackageJsonExists(dirPath: string): string {
    const packageJsonPath = this.getPackageJsonPath(dirPath);
    if (!packageJsonPath) {
      throw new Error(`package.json does not exist in directory "${dirPath}"`);
    }
    return packageJsonPath;
  }
}