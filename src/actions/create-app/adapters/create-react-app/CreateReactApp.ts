import { dirname, resolve } from 'path';

import { injectable } from 'inversify';

import { PackageManagerType } from '../../../../services/package-manager/PackageManagerService';
import { AbstractCreateAppAdapter } from '../CreateAppAdapter';

@injectable()
export default class CreateReactApp extends AbstractCreateAppAdapter {
  protected name = 'Create a new React app';

  /**
   * Define the namespace to be used for generating files from templates
   */
  protected namespace = 'react';

  /**
   * Define where the application entrypoint file is located
   */
  protected entrypointPath = 'src/index.tsx';

  /**
   * Define where the main application file is located
   */
  protected applicationPath = 'src/App.tsx';

  /**
   * Define where the lib files are located
   */
  protected libPath = 'src';

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

    await this.packageManagerService.installPackages(realpath, ['@reactionable/router-dom']);
    await this.packageManagerService.installPackages(
      realpath,
      ['@types/react-helmet', '@types/react-router-dom', '@types/yup'],
      true,
      true
    );

    this.fileService.mkdirSync(resolve(realpath, this.libPath, 'components'), true);

    // Create app components
    this.consoleService.info('Create base components...');
    await this.createComponent.run({
      realpath,
      name: 'App',
      componentDirPath: resolve(realpath, this.getAppFilePath()),
      componentTemplate: 'app/react/App.tsx',
    });
    await this.createComponent.run({
      realpath,
      name: 'NotFound',
      componentTemplate: 'not-found/NotFound.tsx',
    });
    await this.createComponent.run({ realpath, name: 'Home' });
    this.consoleService.success(`Base components have been created in "${realpath}"`);
  }

  async checkIfAppExistsAlready(
    realpath: string,
    shouldPrompt = true
  ): Promise<boolean | undefined> {
    const appExists = await super.checkIfAppExistsAlready(realpath, shouldPrompt);
    if (!appExists) {
      return appExists;
    }

    const reactAppExists =
      (await this.packageManagerService.hasPackageJson(realpath)) &&
      (await this.packageManagerService.hasInstalledPackage(realpath, 'react')) &&
      this.fileService.fileExistsSync(
        resolve(realpath, this.getLibDirectoryPath(), 'react-app-env.d.ts')
      );

    return reactAppExists;
  }

  async addSass(realpath: string): Promise<void> {
    await super.addSass(realpath);

    // Replace css files
    this.fileService.replaceFileExtension(
      resolve(realpath, this.getLibDirectoryPath(), 'index.css'),
      'scss'
    );
    this.fileService.replaceFileExtension(
      resolve(realpath, this.getLibDirectoryPath(), 'App.css'),
      'scss'
    );

    await this.fileFactory
      .fromFile(resolve(realpath, this.getEntrypointFilePath()))
      .replaceContent(/import '\.\/index\.css';/, "import './index.scss';")
      .saveFile();

    await this.fileFactory
      .fromFile(resolve(realpath, this.getAppFilePath()))
      .replaceContent(/import '\.\/App\.css';/, "import './App.scss';")
      .saveFile();
  }
}
