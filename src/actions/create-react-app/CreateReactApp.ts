import { basename, dirname, resolve } from 'path';

import { red } from 'chalk';
import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';

import { CliService } from '../../services/CliService';
import { ConsoleService } from '../../services/ConsoleService';
import { FileFactory } from '../../services/file/FileFactory';
import { FileService } from '../../services/file/FileService';
import {
  PackageManagerService,
  PackageManagerType,
} from '../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../services/TemplateService';
import AddHosting from '../add-hosting/AddHosting';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddVersioning from '../add-versioning/AddVersioning';
import CreateComponent from '../create-component/CreateComponent';
import GenerateReadme from '../generate-readme/GenerateReadme';
import { NamedAction, NamedActionOptions } from '../NamedAction';

@injectable()
export default class CreateReactApp implements NamedAction {
  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(TemplateService) private readonly templateService: TemplateService,
    @inject(CliService) private readonly cliService: CliService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(PackageManagerService)
    private readonly packageManagerService: PackageManagerService,
    @inject(AddUIFramework) private addUIFramework: AddUIFramework,
    @inject(AddHosting) private readonly addHosting: AddHosting,
    @inject(AddVersioning) private readonly addVersioning: AddVersioning,
    @inject(CreateComponent) private readonly createComponent: CreateComponent,
    @inject(GenerateReadme) private readonly generateReadme: GenerateReadme
  ) {}

  getName(): string {
    return 'Create a new react app';
  }

  async run({ realpath }: NamedActionOptions): Promise<void> {
    const reactAppExistsAlready = await this.checkIfReactAppExistsAlready(realpath);
    if (reactAppExistsAlready === undefined) {
      return;
    }

    if (!reactAppExistsAlready) {
      const packageManager = await this.choosePackageManager();
      if (!packageManager) {
        return;
      }

      const createReactAppCmd = this.cliService.getGlobalCmd('create-react-app');
      if (!createReactAppCmd) {
        return this.consoleService.error(
          'Unable to create app, install globally "create-react-app" or "npx"'
        );
      }

      // Create app
      this.consoleService.info('Creating app...');
      const cmdArgs = [createReactAppCmd, realpath, '--template', 'typescript'];
      if (packageManager === PackageManagerType.npm) {
        cmdArgs.push('--use-npm');
      }
      await this.cliService.execCmd(cmdArgs, dirname(realpath));
      this.consoleService.success(`App has been created in "${realpath}"`);
    }

    await this.packageManagerService.installPackages(realpath, [
      '@reactionable/core',
      '@types/react-helmet',
      '@types/react-router-dom',
      '@types/yup',
    ]);

    await this.packageManagerService.updatePackageJson(realpath, {
      scripts: { lint: 'eslint "src/**/*.{js,ts,tsx}"' },
    });

    // Create app components
    this.consoleService.info('Create base components...');
    await this.createComponent.run({ realpath, name: 'App' });
    await this.createComponent.run({ realpath, name: 'NotFound' });
    await this.createComponent.run({ realpath, name: 'Home' });
    this.consoleService.success(`Base components have been created in "${realpath}"`);

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

  async checkIfReactAppExistsAlready(realpath: string): Promise<boolean | undefined> {
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

      if (
        this.packageManagerService.hasPackageJson(realpath) &&
        this.packageManagerService.hasInstalledPackage(realpath, 'react') &&
        this.fileService.fileExistsSync(resolve(realpath, 'src/react-app-env.d.ts'))
      ) {
        return true;
      }
    } else {
      const parentDir = dirname(realpath);
      if (!this.fileService.dirExistsSync(parentDir)) {
        this.consoleService.error(
          `Unable to create app "${basename(realpath)}", directory "${parentDir}" does not exist.`
        );
        return undefined;
      }
    }
    return false;
  }

  async addSass(realpath: string): Promise<void> {
    // Add Saas
    this.consoleService.info('Adding Sass...');
    await this.packageManagerService.installPackages(realpath, ['node-sass']);

    // Replace css files
    this.fileService.replaceFileExtension(resolve(realpath, 'src/index.css'), 'scss');
    this.fileService.replaceFileExtension(resolve(realpath, 'src/App.css'), 'scss');

    await this.fileFactory
      .fromFile(resolve(realpath, 'src/index.tsx'))
      .replaceContent(/import '\.\/index\.css';/, "import './index.scss';")
      .saveFile();

    await this.fileFactory
      .fromFile(resolve(realpath, 'src/App.tsx'))
      .replaceContent(/import '\.\/App\.css';/, "import './App.scss';")
      .saveFile();

    this.consoleService.success(`Sass has been added in "${realpath}"`);
  }

  async addI18n(realpath: string): Promise<void> {
    // Add i18n config
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
