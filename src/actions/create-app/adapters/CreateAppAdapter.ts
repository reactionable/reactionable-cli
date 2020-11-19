import { basename, dirname, resolve } from 'path';

import { red } from 'chalk';
import { prompt } from 'inquirer';
import { LazyServiceIdentifer, inject, injectable } from 'inversify';

import { CliService } from '../../../services/CliService';
import { ConsoleService } from '../../../services/ConsoleService';
import { FileFactory } from '../../../services/file/FileFactory';
import { FileService } from '../../../services/file/FileService';
import { TypescriptFile } from '../../../services/file/TypescriptFile';
import { TypescriptImport } from '../../../services/file/TypescriptImport';
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
import CreateComponent from '../../create-component/CreateComponent';
import GenerateReadme from '../../generate-readme/GenerateReadme';

export type CreateAppAdapterOptions = AdapterActionOptions;

export type CreateAppAdapter<
  O extends CreateAppAdapterOptions = CreateAppAdapterOptions
> = AdapterAction<O> & {
  getTemplateNamespace(): string;
  getEntrypointFilePath(): string;
  getAppFilePath(): string;
  getLibDirectoryPath(): string;
};

@injectable()
export abstract class AbstractCreateAppAdapter
  extends AbstractAdapterAction
  implements CreateAppAdapter {
  /**
   * Define the namespace to be used for generating files from templates
   */
  protected abstract namespace: string;

  /**
   * Define where the application entrypoint file is located
   */
  protected abstract entrypointPath: string;

  /**
   * Define where the main application file is located
   */
  protected abstract applicationPath: string;

  /**
   * Define where the lib files are located
   */
  protected abstract libPath: string;

  constructor(
    @inject(FileService) protected readonly fileService: FileService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(new LazyServiceIdentifer(() => AddUIFramework))
    protected readonly addUIFramework: AddUIFramework,
    @inject(new LazyServiceIdentifer(() => AddHosting))
    protected readonly addHosting: AddHosting,
    @inject(AddVersioning) protected readonly addVersioning: AddVersioning,
    @inject(GenerateReadme) protected readonly generateReadme: GenerateReadme,
    @inject(TemplateService) protected readonly templateService: TemplateService,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(FileFactory) protected readonly fileFactory: FileFactory,
    @inject(CreateComponent) protected readonly createComponent: CreateComponent,
    @inject(CliService) protected readonly cliService: CliService
  ) {
    super();
  }

  /**
   * Custom method to create the app
   * @param props
   */
  abstract createApp(props: { realpath: string; appExistsAlready: boolean }): Promise<void>;

  getTemplateNamespace(): string {
    return this.namespace;
  }

  getEntrypointFilePath(): string {
    return this.entrypointPath;
  }

  getAppFilePath(): string {
    return this.applicationPath;
  }

  getLibDirectoryPath(): string {
    return this.libPath;
  }

  async isEnabled(realpath: string): Promise<boolean> {
    const appExists = await this.checkIfAppExistsAlready(realpath, false);
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

    // Add Sass
    await this.addSass(realpath);

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
  async checkIfAppExistsAlready(
    realpath: string,
    shouldPrompt = true
  ): Promise<boolean | undefined> {
    if (this.fileService.dirExistsSync(realpath)) {
      if (shouldPrompt) {
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
    await this.packageManagerService.execPackageManagerCmd(realpath, 'ts-dev-tools install');
    this.consoleService.success(`ts-dev-tools configuration has been installed`);
  }

  async addSass(realpath: string): Promise<void> {
    // Add Saas
    this.consoleService.info('Adding Sass...');
    await this.packageManagerService.installPackages(realpath, ['sass']);

    this.consoleService.success(`Sass has been added in "${realpath}"`);
  }

  /**
   * Create I18n configuration files
   * @param realpath
   */
  async addI18n(realpath: string): Promise<void> {
    this.consoleService.info('Add i18n configuration...');
    const i18nPath = resolve(realpath, this.getLibDirectoryPath(), 'i18n');
    await this.templateService.renderTemplate(realpath, 'i18n', {
      i18nPath,
      projectName: JSON.stringify(
        await this.packageManagerService.getPackageName(realpath, 'capitalizeWords')
      ),
      hostingPackage: await this.createComponent.getHostingPackage(realpath),
    });

    // Import and add translations as i18n ressources
    await this.fileFactory
      .fromFile<TypescriptFile>(resolve(realpath, this.getEntrypointFilePath()))
      .setImports([
        {
          packageName: './i18n/i18n.ts',
          modules: { [TypescriptImport.defaultImport]: TypescriptImport.defaultImport },
        },
      ])
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
