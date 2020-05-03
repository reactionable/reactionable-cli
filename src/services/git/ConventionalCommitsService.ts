import { injectable, inject } from 'inversify';
import { relative, resolve } from 'path';

import { PackageManagerService } from '../package-manager/PackageManagerService';
import { TemplateService } from '../TemplateService';

@injectable()
export class ConventionalCommitsService {
  static conventionalCommitsPackages = [
    '@commitlint/cli',
    '@commitlint/config-conventional',
    'cz-conventional-changelog',
    'husky',
  ];

  constructor(
    @inject(PackageManagerService)
    private readonly packageManagerService: PackageManagerService,
    @inject(TemplateService)
    private readonly templateService: TemplateService
  ) {}

  async hasConventionalCommits(realpath: string): Promise<boolean> {
    for (const packageName of ConventionalCommitsService.conventionalCommitsPackages) {
      if (
        !this.packageManagerService.hasInstalledPackage(
          realpath,
          packageName,
          true
        )
      ) {
        return false;
      }
    }

    const conventionalCommitsConfig = await this.getConventionalCommitsConfig(
      realpath
    );

    return this.packageManagerService.hasPackageJsonConfig(
      realpath,
      conventionalCommitsConfig
    );
  }

  async getConventionalCommitsConfig(
    realpath: string
  ): Promise<{
    husky: {
      hooks: {
        'commit-msg': string;
      };
    };
    config: {
      commitizen: {
        path: string;
      };
    };
  }> {
    const nodeModulesDirPath = await this.packageManagerService.getNodeModulesDirPath(
      realpath
    );

    return {
      husky: {
        hooks: {
          'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
        },
      },
      config: {
        commitizen: {
          path: `./${relative(
            realpath,
            resolve(nodeModulesDirPath, 'cz-conventional-changelog').toString()
          )}`,
        },
      },
    };
  }

  async initializeConventionalCommits(realpath: any): Promise<void> {
    await this.packageManagerService.installPackages(
      realpath,
      ConventionalCommitsService.conventionalCommitsPackages,
      false,
      true
    );

    const conventionalCommitsConfig = await this.getConventionalCommitsConfig(
      realpath
    );

    await this.packageManagerService.updatePackageJson(
      realpath,
      conventionalCommitsConfig
    );

    await this.templateService.renderTemplateTree(realpath, 'add-versioning', [
      'commitlint.config.js',
    ]);
  }

  async formatCommitMessage(
    realpath: string,
    commitMessageType: string,
    commitMessage: string
  ): Promise<string> {
    let commitPrefix = commitMessageType.toLowerCase();

    const isMonorepoPackage = await this.packageManagerService.isMonorepoPackage(
      realpath
    );

    if (isMonorepoPackage) {
      const projectName = await this.packageManagerService.getPackageName(
        realpath,
        'hyphenize',
        false
      );
      commitPrefix += `(${projectName})`;
    }

    return `${commitPrefix}: ${commitMessage}`;
  }
}
