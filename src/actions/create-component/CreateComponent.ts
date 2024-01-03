import { basename, dirname, extname, resolve } from "path";

import { LazyServiceIdentifer, inject, injectable } from "inversify";
import prompts from "prompts";

import { ConsoleService } from "../../services/ConsoleService";
import { FileFactory } from "../../services/file/FileFactory";
import { PackageManagerService } from "../../services/package-manager/PackageManagerService";
import { StringUtils } from "../../services/StringUtils";
import { TemplateContext } from "../../services/template/TemplateContext";
import { TemplateService } from "../../services/template/TemplateService";
import { AbstractAdapterWithPackageAction } from "../AbstractAdapterWithPackageAction";
import AddHosting from "../add-hosting/AddHosting";
import AddRouter from "../add-router/AddRouter";
import AddUIFramework from "../add-ui-framework/AddUIFramework";
import { CreateAppAdapter } from "../create-app/adapters/CreateAppAdapter";
import CreateApp from "../create-app/CreateApp";
import { NamedAction, NamedActionOptions } from "../NamedAction";
import { DirectoryService } from "../../services/file/DirectoryService";

export type CreateComponentOptions = NamedActionOptions & {
  name?: string;
  componentTemplate?: string;
  // Can be the directory folder where to create the component or the file path of an existing component
  componentDirPath?: string;
};

@injectable()
export default class CreateComponent implements NamedAction<CreateComponentOptions> {
  protected static defaultPackage = "@reactionable/core";
  protected static templateNamespace = "create-component";

  constructor(
    @inject(new LazyServiceIdentifer(() => AddUIFramework))
    private readonly addUIFramework: AddUIFramework,
    @inject(new LazyServiceIdentifer(() => AddHosting))
    private readonly addHosting: AddHosting,
    @inject(new LazyServiceIdentifer(() => AddRouter))
    private readonly addRouter: AddRouter,
    @inject(new LazyServiceIdentifer(() => CreateApp))
    private readonly createApp: CreateApp,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(DirectoryService) protected readonly directoryService: DirectoryService,
    @inject(TemplateService) protected readonly templateService: TemplateService,
    @inject(FileFactory) protected readonly fileFactory: FileFactory
  ) {}

  getName(): string {
    return "Create a new component";
  }

  async run({ realpath, name, ...options }: CreateComponentOptions): Promise<void> {
    if (!name) {
      const answer = await prompts([
        {
          type: "text",
          name: "name",
          message: "What's the component name?",
          validate: (input) => (input.trim().length ? true : "Component name is required"),
          format: (input) => this.formatName(input),
        },
      ]);
      name = answer.name as string;
    }

    name = this.formatName(name);
    this.consoleService.info(`Create component "${name}"...`);

    const componentDirPath = await this.createComponent({ realpath, name, ...options });

    this.consoleService.success(`Component "${name}" has been created in "${componentDirPath}"`);
  }

  protected async createComponent({
    realpath,
    componentDirPath,
    name,
    componentTemplate = "standalone/Standalone.tsx",
    testComponentTemplate = "standalone/Standalone.test.tsx",
    templateContext = {},
  }: {
    realpath: string;
    name: string;
    componentDirPath?: string;
    componentTemplate?: string;
    testComponentTemplate?: string;
    templateContext?: TemplateContext;
  }): Promise<string> {
    let componentFilename = name + ".tsx";

    if (!componentDirPath) {
      componentDirPath = resolve(
        realpath,
        (await this.getCreateAppAdapter(realpath)).getLibDirectoryPath(),
        "components",
        StringUtils.hyphenize(name)
      );
    } else if (extname(componentDirPath)) {
      componentFilename = basename(componentDirPath);
      componentDirPath = dirname(componentDirPath);
    } else {
      componentDirPath = resolve(componentDirPath, StringUtils.hyphenize(name));
    }

    const componentParentDirPath = dirname(componentDirPath);
    const componentParentDirExists = await this.directoryService.dirExists(componentParentDirPath);
    if (!componentParentDirExists) {
      throw new Error(
        `Unable to create component "${name}" in unexisting directory "${componentParentDirPath}"`
      );
    }

    // Get enabled UI framework
    const projectName = await this.packageManagerService.getPackageName(
      realpath,
      "capitalizeWords"
    );
    const uiPackage = await this.getUIPackage(realpath);
    const routerPackage = await this.getRouterPackage(realpath);
    const hostingPackage = await this.getHostingPackage(realpath);

    const testComponentFilename = componentFilename.split(".").slice(0, -1).join(".") + ".test.tsx";
    const context = {
      ...templateContext,
      componentName: name,
      componentDirname: basename(componentDirPath),
      componentFilename,
      componentTemplate,
      testComponentFilename,
      testComponentTemplate,
      projectName,
      uiPackage,
      hostingPackage,
      routerPackage,
    };

    // Create component from template
    const namespace = CreateComponent.templateNamespace;
    await this.templateService.renderTemplate(dirname(componentDirPath), namespace, context);

    return componentDirPath;
  }

  protected formatName(name: string): string {
    return StringUtils.capitalize(StringUtils.camelize(name.trim()));
  }

  protected async getUIPackage(realpath: string): Promise<string> {
    const uiPackage = (await this.addUIFramework.detectAdapter(realpath))?.getAdapterPackageName();
    if (uiPackage) {
      return uiPackage;
    }
    return CreateComponent.defaultPackage;
  }

  protected async getRouterPackage(realpath: string): Promise<string> {
    const routerPackage = (await this.addRouter.detectAdapter(realpath))?.getAdapterPackageName();
    if (routerPackage) {
      return routerPackage;
    }
    return CreateComponent.defaultPackage;
  }

  public async getHostingPackage(realpath: string): Promise<string> {
    const hostingAdapter = await this.addHosting.detectAdapter(realpath);

    if (hostingAdapter && hostingAdapter instanceof AbstractAdapterWithPackageAction) {
      return hostingAdapter.getAdapterPackageName();
    }

    return CreateComponent.defaultPackage;
  }

  protected async getCreateAppAdapter(realpath: string): Promise<CreateAppAdapter> {
    const adapter = await this.createApp.detectAdapter(realpath);
    if (!adapter) {
      throw new Error(`Unable to detect app type for given path "${realpath}"`);
    }
    return adapter;
  }
}
