import { dirname, resolve } from 'path';

import { inject, injectable } from 'inversify';

import { CliService } from '../../../../services/CliService';
import { ConsoleService } from '../../../../services/ConsoleService';
import { FileFactory } from '../../../../services/file/FileFactory';
import { FileService } from '../../../../services/file/FileService';
import {
  PackageManagerService,
  PackageManagerType,
} from '../../../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../../../services/TemplateService';
import AddHosting from '../../../add-hosting/AddHosting';
import AddUIFramework from '../../../add-ui-framework/AddUIFramework';
import AddVersioning from '../../../add-versioning/AddVersioning';
import CreateComponent from '../../../create-component/CreateComponent';
import GenerateReadme from '../../../generate-readme/GenerateReadme';
import { AbstractCreateAppAdapter } from '../CreateAppAdapter';

@injectable()
export default class CreateReactApp extends AbstractCreateAppAdapter {
  protected name = 'Create a new react app';

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
    @inject(FileFactory) protected readonly fileFactory: FileFactory,
    @inject(CliService) private readonly cliService: CliService,
    @inject(CreateComponent) private readonly createComponent: CreateComponent
  ) {
    super(
      fileService,
      consoleService,
      addUIFramework,
      addHosting,
      addVersioning,
      generateReadme,
      templateService,
      packageManagerService,
      fileFactory
    );
  }

  async createApp({
    realpath,
    appExistsAlready,
  }: {
    realpath: string;
    appExistsAlready: boolean;
  }): Promise<void> {
    if (!appExistsAlready) {
      const createReactAppCmd = this.cliService.getGlobalCmd('create-react-app');
      if (!createReactAppCmd) {
        return this.consoleService.error(
          'Unable to create app, install globally "create-react-app" or "npx"'
        );
      }

      // Create app
      const packageManager = await this.choosePackageManager();
      if (!packageManager) {
        return;
      }

      this.consoleService.info('Creating app...');
      const cmdArgs = [createReactAppCmd, realpath, '--template', 'typescript'];
      if (packageManager === PackageManagerType.npm) {
        cmdArgs.push('--use-npm');
      }
      await this.cliService.execCmd(cmdArgs, dirname(realpath));
      this.consoleService.success(`App has been created in "${realpath}"`);
    }

    await this.packageManagerService.installPackages(realpath, ['@reactionable/core']);
    await this.packageManagerService.installPackages(
      realpath,
      ['@types/react-helmet', '@types/react-router-dom', '@types/yup'],
      true,
      true
    );

    // Create app components
    this.consoleService.info('Create base components...');
    await this.createComponent.run({ realpath, name: 'App' });
    await this.createComponent.run({ realpath, name: 'NotFound' });
    await this.createComponent.run({ realpath, name: 'Home' });
    this.consoleService.success(`Base components have been created in "${realpath}"`);

    // Add Sass
    await this.addSass(realpath);
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

  async checkIfAppExistsAlready(realpath: string): Promise<boolean | undefined> {
    const appExists = await super.checkIfAppExistsAlready(realpath);
    if (!appExists) {
      return appExists;
    }

    const reactAppExists =
      this.packageManagerService.hasPackageJson(realpath) &&
      this.packageManagerService.hasInstalledPackage(realpath, 'react') &&
      this.fileService.fileExistsSync(resolve(realpath, 'src/react-app-env.d.ts'));

    return reactAppExists;
  }
}
