export interface PackageJsonDependencies {
  [key: string]: string;
}

export interface PackageJson {
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
      'commit-msg'?: string;
    };
  };
  config?: {
    commitizen?: {
      path?: string;
    };
  };
}

export interface IPackageManager<PJ extends PackageJson = PackageJson> {
  getCmd(): string;

  getNodeModulesDirPath(): Promise<string>;

  installPackages(packages: string[], dev?: boolean): Promise<string[]>;

  isMonorepoPackage(): Promise<boolean>;
  getMonorepoRootPath(): Promise<string | undefined>;

  getPackageJsonData(): PJ;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P,
    encoding?: string
  ): PJ[P] | undefined;
  getPackageJsonData<P extends keyof PJ = keyof PJ>(
    property: P | undefined,
    encoding: string
  ): PackageJson | PJ[P] | undefined;
}