export interface IPackageManager {
  getNodeModulesDirPath(): Promise<string>;

  installPackages(packages: string[], dev?: boolean): Promise<string[]>;

  isMonorepo(): Promise<boolean>;
}
