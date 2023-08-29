import { dirname, join, resolve } from "path";

import { injectable } from "inversify";

import { PackageManagerType } from "../../../../services/package-manager/PackageManagerService";
import { AbstractCreateAppAdapter } from "../CreateAppAdapter";

@injectable()
export default class CreateNextApp extends AbstractCreateAppAdapter {
  protected name = "Create a new NextJs app";

  /**
   * Define the namespace to be used for generating files from templates
   */
  protected namespace = "nextjs";

  /**
   * Define where the application entrypoint file is located
   */
  protected entrypointPath = "pages/_app.tsx";

  /**
   * Define where the main application file is located
   */
  protected applicationPath = "pages/_app.tsx";

  /**
   * Define where the lib files are located
   */
  protected libPath = "lib";

  async createApp({
    realpath,
    appExistsAlready,
  }: {
    realpath: string;
    appExistsAlready: boolean;
  }): Promise<void> {
    if (!appExistsAlready) {
      const hasGitDir = this.fileService.dirExistsSync(resolve(realpath, ".git"));
      const npxCmd = "create-next-app";
      const createAppCmd = this.cliService.getGlobalCmd(npxCmd);
      if (!createAppCmd) {
        return this.consoleService.error(
          `Unable to create app, install globally "${npxCmd}" or "npx"`
        );
      }

      // Create app
      const packageManager = await this.choosePackageManager();
      if (!packageManager) {
        return;
      }

      this.consoleService.info("Creating app...");
      const cmdArgs = [createAppCmd, realpath];
      if (packageManager === PackageManagerType.npm) {
        cmdArgs.push("--use-npm");
      }
      await this.cliService.execCmd(cmdArgs, dirname(realpath));

      // Remove created git dir
      if (!hasGitDir) {
        this.fileService.rmdirSync(resolve(realpath, ".git"));
      }

      this.consoleService.success(`App has been created in "${realpath}"`);

      this.fileService.touchFileSync(join(realpath, "tsconfig.json"));
      await this.packageManagerService.installPackages(realpath, [
        "typescript",
        "@types/react",
        "@types/node",
      ]);
      await this.packageManagerService.execPackageManagerCmd(realpath, ["next", "build"]);
    }

    // Replace js files
    this.fileService.replaceFileExtension(resolve(realpath, "pages/_app.js"), "tsx");
    this.fileService.replaceFileExtension(resolve(realpath, "pages/index.js"), "tsx");
    this.fileService.replaceFileExtension(resolve(realpath, "pages/api/hello.js"), "ts");

    await this.packageManagerService.uninstallPackages(realpath, ["@types/react", "@types/node"]);
    await this.packageManagerService.installPackages(realpath, ["@reactionable/nextjs"]);

    this.fileService.mkdirSync(resolve(realpath, this.libPath, "components"), true);

    // Create app components
    this.consoleService.info("Create base components...");
    await this.createComponent.run({
      realpath,
      name: "App",
      componentDirPath: resolve(realpath, this.getAppFilePath()),
      componentTemplate: "app/nextjs/App.tsx",
    });
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
      (await this.packageManagerService.hasInstalledPackage(realpath, "next"));

    return reactAppExists;
  }

  async addSass(realpath: string): Promise<void> {
    await super.addSass(realpath);

    // Replace css files
    this.fileService.replaceFileExtension(resolve(realpath, "styles/globals.css"), "scss");
    this.fileService.replaceFileExtension(resolve(realpath, "styles/Home.module.css"), "scss");

    await this.fileFactory
      .fromFile(resolve(realpath, this.getAppFilePath()))
      .replaceContent(/import '\.\.\/styles\/globals\.css'/, "import '../styles/globals.scss'")
      .saveFile();

    await this.fileFactory
      .fromFile(resolve(realpath, "pages/index.tsx"))
      .replaceContent(
        /import styles from '\.\.\/styles\/Home\.module\.css'/,
        "import styles from '../styles/Home.module.scss'"
      )
      .saveFile();
  }
}
