import { JsonFileData } from "../../file/JsonFile";

export interface PackageJsonDependencies {
  [key: string]: string;
}

export interface PackageJson extends JsonFileData {
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
  scripts?: {
    [key: string]: string;
  };
  husky?: {
    hooks?: {
      "commit-msg"?: string;
    };
  };
  config?: {
    commitizen?: {
      path?: string;
    };
  };
}

export interface IPackageManager<PJ extends PackageJson = PackageJson> {
  /**
   * Check if the current path is related to this package manager
   */
  isEnabled(): Promise<boolean>;

  getCmd(): string;

  getNodeModulesDirPath(): Promise<string>;

  installPackages(packages: string[], dev?: boolean): Promise<string[]>;
  uninstallPackages(packages: string[]): Promise<string[]>;

  isMonorepoPackage(): Promise<boolean>;
  getMonorepoRootPath(): Promise<string | undefined>;

  getPackageJsonData(): Promise<PJ>;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P,
    encoding?: BufferEncoding
  ): Promise<PJ[P] | undefined>;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P | undefined,
    encoding: BufferEncoding
  ): Promise<PackageJson | PJ[P] | undefined>;

  execCmd(cmd: string | string[], silent: boolean): Promise<string>;
}
