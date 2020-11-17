import { basename, dirname, resolve } from 'path';

import { red } from 'chalk';
import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';

import { ConsoleService } from '../../../services/ConsoleService';
import { FileFactory } from '../../../services/file/FileFactory';
import { FileService } from '../../../services/file/FileService';
import {
  PackageManagerService,
  PackageManagerType,
} from '../../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../../services/TemplateService';
import { AbstractAdapterAction, AdapterActionOptions } from '../../AbstractAdapterAction';
import { AdapterAction } from '../../AdapterAction';
import AddHosting from '../../add-hosting/AddHosting';
import AddUIFramework from '../../add-ui-framework/AddUIFramework';
import AddVersioning from '../../add-versioning/AddVersioning';
import GenerateReadme from '../../generate-readme/GenerateReadme';

export type CreateAppAdapterOptions = AdapterActionOptions;

export type CreateAppAdapter<
  O extends CreateAppAdapterOptions = CreateAppAdapterOptions
> = AdapterAction<O>;

@injectable()
export abstract class AbstractCreateAppAdapter
  extends AbstractAdapterAction
  implements CreateAppAdapter {
  constructor(
    @inject(FileService) protected readonly fileService: FileService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(AddUIFramework) protected addUIFramework: AddUIFramework,
    @inject(AddHosting) protected readonly addHosting: AddHosting,
    @inject(AddVersioning) protected readonly addVersioning: AddVersioning,
    @inject(GenerateReadme) protected readonly generateReadme: GenerateReadme,
    @inject(TemplateService) protected readonly templateService: TemplateService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(FileFactory) protected readonly fileFactory: FileFactory
  ) {
    super();
  }

  /**
   * Custom method to create the app
   * @param props
   */
  abstract createApp(props: { realpath: string; appExistsAlready: boolean }): Promise<void>;

  async isEnabled(realpath: string): Promise<boolean> {
    const appExists = await this.checkIfAppExistsAlready(realpath);
    return !!appExists;
  }

  async run({ realpath }: AdapterActionOptions): Promise<void> {
    const appExistsAlready = await this.checkIfAppExistsAlready(realpath);
    if (appExistsAlready === undefined) {
      return;
    }

    await this.createApp({
      realpath,
      appExistsAlready,
    });

    // Add ts-dev-tools
    await this.addTsDevTools(realpath);

    // Add I18n
    await this.addI18n(realpath);

    // Add UI framework
    await this.addUIFramework.run({ realpath });

    // Add Versioning
    await this.addVersioning.run({ realpath });

    // Add hosting
    await this.addHosting.run({ realpath });

    // Generate README
    await this.generateReadme.run({ realpath, mustPrompt: true });
  }

  /**
   * Check if given realpath is related to an exising app
   * @param realpath
   */
  async checkIfAppExistsAlready(realpath: string): Promise<boolean | undefined> {
    if (this.fileService.dirExistsSync(realpath)) {
      const { override } = await prompt([
        {
          type: 'confirm',
          name: 'override',
          message: `Directory "${realpath}" exists already, ${red('override it?')}`,
        },
      ]);

      if (!override) {
        return undefined;
      }

      return true;
    }

    const parentDir = dirname(realpath);
    if (!this.fileService.dirExistsSync(parentDir)) {
      this.consoleService.error(
        `Unable to create app "${basename(realpath)}", directory "${parentDir}" does not exist.`
      );
      return undefined;
    }

    return false;
  }

  /**
   * Add ts-dev-tools and install it
   * @param realpath
   */
  async addTsDevTools(realpath: string): Promise<void> {
    this.consoleService.info('Add ts-dev-tools...');

    await this.packageManagerService.installPackages(realpath, ['@ts-dev-tools/react'], true, true);
    await this.packageManagerService.execCmd(realpath, 'ts-dev-tools install');
    this.consoleService.success(`ts-dev-tools configuration has been installed`);
  }

  /**
   * Create I18n configuration files
   * @param realpath
   */
  async addI18n(realpath: string): Promise<void> {
    this.consoleService.info('Add i18n configuration...');
    const i18nPath = 'src/i18n';
    await this.templateService.renderTemplateTree(
      realpath,
      'i18n',
      {
        [i18nPath]: ['i18n.ts', 'locales/en/translation.json', 'locales/fr/translation.json'],
      },
      {
        projectName: JSON.stringify(
          await this.packageManagerService.getPackageName(realpath, 'capitalizeWords')
        ),
      }
    );

    await this.fileFactory
      .fromFile(resolve(realpath, 'src/index.tsx'))
      .appendContent("import './i18n/i18n.ts';", "import './index.scss';")
      .saveFile();

    this.consoleService.success(
      `I18n configuration has been created in "${resolve(realpath, i18nPath)}"`
    );
  }

  /**
   * Prompt the user to choos is prefred package manager, depending on which are available
   */
  async choosePackageManager(): Promise<PackageManagerType | undefined> {
    const availablePackageManagers = this.packageManagerService.getAvailablePackageManagers();

    switch (availablePackageManagers.length) {
      case 0:
        this.consoleService.error(
          `Unable to create app, install a package manager like ${this.packageManagerService
            .getAvailablePackageManagers()
            .join(' or ')}`
        );
        return;

      case 1:
        return availablePackageManagers[0];

      default: {
        // Prompts user to choose package manager
        const result = await prompt<{
          packageManager: PackageManagerType;
        }>([
          {
            name: 'packageManager',
            message: 'Wich package manager do you want to use?',
            type: 'list',
            choices: [
              ...availablePackageManagers.map((packageManager) => ({
                name: packageManager,
                value: packageManager,
              })),
            ],
          },
        ]);
        return result.packageManager;
      }
    }
  }
}
