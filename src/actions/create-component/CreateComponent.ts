import { join, resolve, dirname, basename } from 'path';
import { injectable, inject } from 'inversify';
import { prompt } from 'inquirer';
import { mkdirSync } from 'fs';

import { ConsoleService } from '../../services/ConsoleService';
import { FileService } from '../../services/file/FileService';
import { PackageManagerService } from '../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../services/TemplateService';
import { IAction } from '../IAction';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddHosting from '../add-hosting/AddHosting';
import { AbstractAdapterWithPackage } from '../AbstractAdapterWithPackage';
import { StringUtils } from '../../services/StringUtils';

@injectable()
export default class CreateComponent
  implements IAction<{ name: string | undefined }> {
  protected static defaultPackage = '@reactionable/core';
  protected static viewsPath = join('', 'src', 'views');
  protected static templateNamespace = 'create-component';

  constructor(
    @inject(AddUIFramework) private readonly addUIFramework: AddUIFramework,
    @inject(AddHosting) private readonly addHosting: AddHosting,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(FileService) protected readonly fileService: FileService,
    @inject(TemplateService) protected readonly templateService: TemplateService
  ) {}

  getName() {
    return 'Create a new react component';
  }

  async run({ realpath, name }) {
    if (!name) {
      const answer = await prompt<{ name: string }>([
        {
          name: 'name',
          message: "What's the component name?",
          validate: (input) =>
            input.trim().length ? true : 'Component name is required',
          transformer: (input) => this.formatName(input),
        },
      ]);
      name = answer.name;
    }

    name = this.formatName(name);
    this.consoleService.info(`Create component "${name}"...`);

    const componentDirPath = await this.createComponent({ realpath, name });

    this.consoleService.success(
      `Component "${name}" has been created in "${componentDirPath}"`
    );
  }

  protected async createComponent({
    realpath,
    componentDirPath,
    name,
    componentTemplate = 'simple/Simple.tsx',
    testComponentTemplate = 'simple/Simple.test.tsx',
    templateContext = {},
  }: {
    realpath: string;
    name: string;
    componentDirPath?: string;
    componentTemplate?: string;
    testComponentTemplate?: string;
    templateContext?: Object;
  }): Promise<string> {
    // Define component path
    const componentDirName = StringUtils.hyphenize(name);

    if (!componentDirPath) {
      componentDirPath = realpath;
    }

    if (componentDirPath.indexOf(CreateComponent.viewsPath) === -1) {
      const viewsRealpath = resolve(
        componentDirPath,
        CreateComponent.viewsPath
      );
      if (!this.fileService.dirExistsSync(viewsRealpath)) {
        mkdirSync(viewsRealpath);
      }
      componentDirPath = resolve(viewsRealpath, componentDirName);
    } else {
      componentDirPath = resolve(componentDirPath, componentDirName);
    }

    switch (name) {
      case 'App':
        componentDirPath = resolve(realpath, 'src');
        componentTemplate = 'app/App.tsx';
        break;
      case 'NotFound':
        componentTemplate = 'not-found/NotFound.tsx';
        break;
    }

    // Get enabled UI framework
    const context = {
      ...templateContext,
      componentName: name,
      projectName: await this.packageManagerService.getPackageName(
        realpath,
        'capitalizeWords'
      ),
      uiPackage: await this.getUIPackage(realpath),
      hostingPackage: await this.getHostingPackage(realpath),
    };

    // Create component from template
    await this.templateService.renderTemplateTree(
      dirname(componentDirPath),
      CreateComponent.templateNamespace,
      {
        [basename(componentDirPath)]: {
          [name + '.tsx']: componentTemplate,
          [name + '.test.tsx']: testComponentTemplate,
        },
      },
      context
    );
    return componentDirPath;
  }

  protected formatName(name: string): string {
    return StringUtils.capitalize(StringUtils.camelize(name.trim()));
  }

  protected async getUIPackage(realpath: string): Promise<string> {
    const uiPackage = (
      await this.addUIFramework.detectAdapter(this.getProjectRootPath(realpath))
    )?.getAdapterPackageName();
    if (uiPackage) {
      return uiPackage;
    }
    return CreateComponent.defaultPackage;
  }

  private async getHostingPackage(realpath: string): Promise<string> {
    const hostingAdapter = await this.addHosting.detectAdapter(
      this.getProjectRootPath(realpath)
    );

    if (
      hostingAdapter &&
      hostingAdapter instanceof AbstractAdapterWithPackage
    ) {
      return hostingAdapter.getAdapterPackageName();
    }

    return CreateComponent.defaultPackage;
  }

  private getProjectRootPath(realpath: string): string {
    let projectRootPath: string;
    if (realpath.indexOf(CreateComponent.viewsPath) === -1) {
      projectRootPath = realpath;
    } else {
      projectRootPath = realpath.split(CreateComponent.viewsPath)[0];
    }
    return projectRootPath;
  }
}
