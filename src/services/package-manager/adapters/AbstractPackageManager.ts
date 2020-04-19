import { IPackageManager } from './IPackageManager';
import { which } from 'shelljs';
import { resolve } from 'path';
import { inject } from 'inversify';
import { PackageManagerType } from '../PackageManagerService';
import { CliService } from '../../CliService';

export abstract class AbstractPackageManager implements IPackageManager {
  protected abstract type: PackageManagerType;

  constructor(
    @inject(CliService) protected readonly cliService: CliService,
    protected realpath: string
  ) {}

  async getNodeModulesDirPath(): Promise<string> {
    const result = await this.execCmd('bin', true);
    return resolve(result, '..');
  }

  abstract installPackages(packages: string[], dev: boolean): Promise<string[]>;

  abstract isMonorepo(): Promise<boolean>;

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
