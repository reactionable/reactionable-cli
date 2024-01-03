import { resolve } from "path";

import { LazyServiceIdentifer, inject, injectable } from "inversify";
import prompts from "prompts";

import { CliService } from "../../../../services/CliService";
import { ConsoleService } from "../../../../services/ConsoleService";
import { FileFactory } from "../../../../services/file/FileFactory";
import { FileService } from "../../../../services/file/FileService";
import { JsonFile } from "../../../../services/file/JsonFile";
import { TypescriptFile } from "../../../../services/file/TypescriptFile";
import { TypescriptImport } from "../../../../services/file/TypescriptImport";
import { GitService } from "../../../../services/git/GitService";
import { PackageManagerService } from "../../../../services/package-manager/PackageManagerService";
import { StringUtils } from "../../../../services/StringUtils";
import { TemplateService } from "../../../../services/template/TemplateService";
import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from "../../../AbstractAdapterWithPackageAction";
import { CreateAppAdapter } from "../../../create-app/adapters/CreateAppAdapter";
import CreateApp from "../../../create-app/CreateApp";
import { HostingAdapter } from "../HostingAdapter";

type ProjectConfig = {
  projectName: string;
};

type BackendConfig = {
  auth?: {
    [key: string]: {
      service: string;
      providerPlugin: string;
    };
  };
  api?: {
    [key: string]: {
      service: string;
      providerPlugin: string;
    };
  };
  hosting: {
    amplifyhosting: {
      service: string;
      providerPlugin: string;
      type: string;
    };
  };
};

@injectable()
export default class Amplify extends AbstractAdapterWithPackageAction implements HostingAdapter {
  protected name = "Amplify";
  protected adapterPackageName = "@reactionable/amplify";

  constructor(
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(TemplateService) private readonly templateService: TemplateService,
    @inject(CliService) private readonly cliService: CliService,
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(new LazyServiceIdentifer(() => CreateApp)) protected readonly createApp: CreateApp
  ) {
    super(packageManagerService);
  }

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Add amplify config in App component
    this.consoleService.info("Add amplify config in App component...");

    // Add amplify default configuration files
    this.consoleService.info("Prepare Amplify configuration...");
    const projectBranch = await this.gitService.getGitCurrentBranch(realpath, "master");

    let projectName = await this.getProjectName(realpath);
    if (!projectName) {
      const response = await prompts([
        {
          type: "text",
          name: "projectName",
          initial: await this.packageManagerService.getPackageName(realpath, "camelize"),
          message: "Enter a name for the amplify project",
          format: (value) => StringUtils.camelize(value),
        },
      ]);
      projectName = response.projectName;
    }

    await this.templateService.renderTemplate(realpath, "add-hosting/amplify", {
      projectBranch: JSON.stringify(projectBranch),
      projectPath: JSON.stringify(realpath),
      projectName: JSON.stringify(projectName),
      packageManager: await this.packageManagerService.getPackageManagerCmd(realpath),
    });

    // Configure amplify
    if (!this.getAmplifyCmd()) {
      return this.consoleService.error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }

    this.consoleService.info("Configure Amplify...");

    // Amplify config
    const amplifyConfig = {
      envName: projectBranch,
    };
    const awsCloudFormation = {
      useProfile: true,
      profileName: "default",
    };
    await this.execAmplifyCmd(
      [
        "init",
        "--amplify",
        JSON.stringify(JSON.stringify(amplifyConfig)),
        "--awscloudformation",
        JSON.stringify(JSON.stringify(awsCloudFormation)),
      ],
      realpath
    );

    await this.addAuth(realpath);
    await this.addApi(realpath);
    await this.addHosting(realpath);

    const appFilePath = await this.getAppFilePath(realpath);
    const appFile = await this.fileFactory.fromFile<TypescriptFile>(appFilePath);
    appFile.setImports(
      [
        {
          packageName: "@reactionable/amplify",
          modules: { IIdentityContextProviderProps: "" },
        },
      ],
      [
        {
          packageName: "@reactionable/core",
          modules: { IIdentityContextProviderProps: "" },
        },
      ]
    );
    await appFile.saveFile();

    const entrypointFilePath = await this.getEntrypointFilePath(realpath);
    const entrypointFile = await this.fileFactory.fromFile<TypescriptFile>(entrypointFilePath);
    entrypointFile
      .setImports([
        { packageName: "aws-amplify", modules: { Amplify: TypescriptImport.defaultImport } },
        { packageName: "./aws-exports", modules: { awsconfig: TypescriptImport.defaultImport } },
        {
          packageName: "@aws-amplify/ui/dist/style.css",
          modules: { [TypescriptImport.defaultImport]: TypescriptImport.defaultImport },
        },
      ])
      .appendContent("Amplify.configure(awsconfig);", "import './index.scss';");

    await entrypointFile.saveFile();

    const i18nFilepath = resolve(
      realpath,
      await this.getLibDirectoryPath(realpath),
      "i18n/i18n.ts"
    );

    const i18nFile = await this.fileFactory.fromFile<TypescriptFile>(i18nFilepath);
    i18nFile.setImports(
      [
        {
          packageName: "@reactionable/amplify",
          modules: { initializeI18n: "" },
        },
      ],
      [
        {
          packageName: "@reactionable/core",
          modules: { initializeI18n: "" },
        },
      ]
    );

    await i18nFile.saveFile();

    await this.packageManagerService.installPackages(realpath, ["concurrently"], false, true);
    await this.packageManagerService.updatePackageJson(realpath, {
      scripts: {
        start: 'concurrently "amplify mock" "yarn react-scripts start"',
      },
    });

    this.consoleService.success(`Amplify has been configured in "${realpath}"`);
  }

  private async getCreateAppAdapter(realpath: string): Promise<CreateAppAdapter> {
    const adapter = await this.createApp.detectAdapter(realpath);
    if (!adapter) {
      throw new Error(`Unable to detect app type for given path "${realpath}"`);
    }
    return adapter;
  }

  private async getAppFilePath(realpath: string): Promise<string> {
    const adapter = await this.getCreateAppAdapter(realpath);
    return resolve(realpath, adapter.getAppFilePath());
  }

  private async getEntrypointFilePath(realpath: string): Promise<string> {
    const adapter = await this.getCreateAppAdapter(realpath);
    return resolve(realpath, adapter.getEntrypointFilePath());
  }

  private async getLibDirectoryPath(realpath: string): Promise<string> {
    const adapter = await this.getCreateAppAdapter(realpath);
    return resolve(realpath, adapter.getLibDirectoryPath());
  }

  private getAmplifyCmd(): string | null {
    const localAmplifyCmd = this.cliService.getCmd("amplify");
    if (localAmplifyCmd) {
      return localAmplifyCmd;
    }

    return this.cliService.getGlobalCmd("amplify-app");
  }

  private async execAmplifyCmd(args: string[], realpath: string, silent?: boolean) {
    const cmd = this.getAmplifyCmd();
    if (!cmd) {
      throw new Error(
        'Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"'
      );
    }
    if (cmd === "amplify") {
      await this.cliService.upgradeGlobalPackage("@aws-amplify/cli");
    }
    return this.cliService.execCmd([cmd, ...args], realpath, silent);
  }

  private async getProjectName(realpath: string): Promise<string | undefined> {
    const projectConfigFilePath = resolve(realpath, "amplify/.config/project-config.json");

    if (!(await this.fileService.fileExists(projectConfigFilePath))) {
      return undefined;
    }

    const projectConfigFile = await this.fileFactory.fromFile<JsonFile>(projectConfigFilePath);

    return projectConfigFile.getData<ProjectConfig>()?.projectName;
  }

  private async getBackendConfig(realpath: string): Promise<BackendConfig | undefined> {
    const backendConfigFilePath = resolve(realpath, "amplify/backend/backend-config.json");
    if (!(await this.fileService.fileExists(backendConfigFilePath))) {
      return undefined;
    }

    const backendConfigFile = await this.fileFactory.fromFile<JsonFile>(backendConfigFilePath);

    return backendConfigFile.getData<BackendConfig>();
  }

  private async addAuth(realpath: string) {
    const backendConfig = await this.getBackendConfig(realpath);
    const isAuthAdded = !!backendConfig?.auth;

    if (!isAuthAdded) {
      const { addAuth } = await prompts([
        {
          type: "confirm",
          name: "addAuth",
          message:
            "Do you want to add Authentication (https://docs.amplify.aws/cli/auth/overview)?",
        },
      ]);

      if (!addAuth) {
        return;
      }

      this.consoleService.info("Add Amplify authentication...");
      await this.execAmplifyCmd(["add", "auth"], realpath);
    }

    const appFile = await this.fileFactory.fromFile<TypescriptFile>(
      await this.getAppFilePath(realpath)
    );
    appFile
      .setImports([
        {
          packageName: "@reactionable/amplify",
          modules: {
            useIdentityContextProviderProps: "",
            IIdentityContextProviderProps: "",
          },
        },
      ])
      .replaceContent(/identity: undefined,.*$/m, "identity: useIdentityContextProviderProps(),");
    appFile.saveFile();

    const entrypointFile = await this.fileFactory.fromFile(
      await this.getEntrypointFilePath(realpath)
    );
    entrypointFile.appendContent(
      "import '@aws-amplify/ui/dist/style.css';",
      "import './index.scss';"
    );
    await entrypointFile.saveFile();
  }

  private async addApi(realpath: string) {
    const backendConfig = await this.getBackendConfig(realpath);
    const isApiAdded = !!backendConfig?.api;

    if (isApiAdded) {
      return;
    }

    const { addApi } = await prompts([
      {
        type: "confirm",
        name: "addApi",
        message: "Do you want to add an API?",
      },
    ]);

    if (!addApi) {
      return;
    }

    this.consoleService.info("Add Amplify Api...");
    await this.execAmplifyCmd(["add", "api"], realpath);
  }

  private async addHosting(realpath: string) {
    const backendConfig = await this.getBackendConfig(realpath);
    const isHostingAdded = !!backendConfig?.hosting?.amplifyhosting;

    if (isHostingAdded) {
      return;
    }

    this.consoleService.info("Add Amplify hosting...");
    await this.execAmplifyCmd(["hosting", "add"], realpath);
  }
}
