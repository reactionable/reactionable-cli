import { basename, dirname, join, relative, resolve } from "path";

import { LazyServiceIdentifier, inject } from "inversify";

import { CliService } from "../../../services/CliService";
import { ConsoleService } from "../../../services/ConsoleService";
import { FileFactory } from "../../../services/file/FileFactory";
import { DirectoryService } from "../../../services/file/DirectoryService";
import { FileService } from "../../../services/file/FileService";
import { TypescriptFile } from "../../../services/file/TypescriptFile";
import { TypescriptImport } from "../../../services/file/TypescriptImport";
import {
  PackageManagerService,
  PackageManagerType,
} from "../../../services/package-manager/PackageManagerService";
import { TemplateService } from "../../../services/template/TemplateService";
import { AbstractAdapterAction, AdapterActionOptions } from "../../AbstractAdapterAction";
import { AdapterAction } from "../../AdapterAction";
import type AddHosting from "../../add-hosting/AddHosting";
import type AddUIFramework from "../../add-ui-framework/AddUIFramework";
import AddVersioning from "../../add-versioning/AddVersioning";
import CreateComponent from "../../create-component/CreateComponent";
import GenerateReadme from "../../generate-readme/GenerateReadme";
import { AddUIFrameworkIdentifier, AddHostingIdentifier } from "../../container";

export type CreateAppAdapterOptions = AdapterActionOptions;

export type CreateAppAdapter<O extends CreateAppAdapterOptions = CreateAppAdapterOptions> =
  AdapterAction<O> & {
    getTemplateNamespace(): string;
    getEntrypointFilePath(): string;
    getAppFilePath(): string;
    getLibDirectoryPath(): string;
  };

export abstract class AbstractCreateAppAdapter
  extends AbstractAdapterAction
  implements CreateAppAdapter
{
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
    @inject(DirectoryService) protected readonly directoryService: DirectoryService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(new LazyServiceIdentifier(() => AddUIFrameworkIdentifier))
    protected readonly addUIFramework: AddUIFramework,
    @inject(new LazyServiceIdentifier(() => AddHostingIdentifier))
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
    const appExists = await this.directoryService.dirExists(realpath);
    if (appExists) {
      if (shouldPrompt) {
        const override = await this.cliService.promptToContinue(
          `Directory "${realpath}" exists already`,
          "what do you want to do?"
        );

        if (!override) {
          return undefined;
        }
      }

      return true;
    }

    const parentDir = dirname(realpath);
    const parentDirExists = await this.directoryService.dirExists(parentDir);
    if (!parentDirExists) {
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
    this.consoleService.info("Add ts-dev-tools...");

    await this.packageManagerService.installPackages(realpath, ["@ts-dev-tools/react"], true, true);
    await this.packageManagerService.execPackageManagerCmd(realpath, "ts-dev-tools install");
    this.consoleService.success(`ts-dev-tools configuration has been installed`);
  }

  async addSass(realpath: string): Promise<void> {
    // Add Saas
    this.consoleService.info("Adding Sass...");
    await this.packageManagerService.installPackages(realpath, ["sass"]);

    this.consoleService.success(`Sass has been added in "${realpath}"`);
  }

  /**
   * Create I18n configuration files
   * @param realpath
   */
  async addI18n(realpath: string): Promise<void> {
    this.consoleService.info("Add i18n configuration...");
    const i18nPath = resolve(realpath, this.getLibDirectoryPath(), "i18n");
    await this.templateService.renderTemplate(realpath, "i18n", {
      i18nPath,
      projectName: JSON.stringify(
        await this.packageManagerService.getPackageName(realpath, "capitalizeWords")
      ),
      hostingPackage: await this.createComponent.getHostingPackage(realpath),
    });

    // Import and add translations as i18n ressources
    const entrypointPath = resolve(realpath, this.getEntrypointFilePath());
    const importPath = join(".", relative(entrypointPath, i18nPath));
    const entrypointFile = await this.fileFactory.fromFile<TypescriptFile>(entrypointPath);
    entrypointFile.setImports([
      {
        packageName: importPath,
        modules: { [TypescriptImport.defaultImport]: TypescriptImport.defaultImport },
      },
    ]);
    await entrypointFile.saveFile();

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
            .join(" or ")}`
        );
        return;

      case 1:
        return availablePackageManagers[0];

      default: {
        return await this.cliService.promptToChoose(
          "Wich package manager do you want to use?",
          availablePackageManagers.reduce(
            (choices, packageManager) => {
              choices[packageManager] = packageManager;
              return choices;
            },
            {} as Record<string, PackageManagerType>
          )
        );
      }
    }
  }
}
