import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';
import { plural, singular } from 'pluralize';

import { ConsoleService } from '../../services/ConsoleService';
import { FileService } from '../../services/file/FileService';
import { PackageManagerService } from '../../services/package-manager/PackageManagerService';
import { TemplateService } from '../../services/TemplateService';
import AddHosting from '../add-hosting/AddHosting';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import CreateComponent, { CreateComponentOptions } from './CreateComponent';

@injectable()
export default class CreateCrudComponent extends CreateComponent {
  constructor(
    @inject(AddUIFramework) addUIFramework: AddUIFramework,
    @inject(AddHosting) addHosting: AddHosting,
    @inject(PackageManagerService)
    protected readonly packageManagerService: PackageManagerService,
    @inject(ConsoleService) protected readonly consoleService: ConsoleService,
    @inject(FileService) protected readonly fileService: FileService,
    @inject(TemplateService) protected readonly templateService: TemplateService
  ) {
    super(
      addUIFramework,
      addHosting,
      packageManagerService,
      consoleService,
      fileService,
      templateService
    );
  }

  getName(): string {
    return 'Create a new react CRUD component';
  }

  async run({ realpath, name }: CreateComponentOptions): Promise<void> {
    if (!name) {
      const answer = await prompt<{ name: string }>([
        {
          name: 'name',
          message: "What's the component entity name?",
          validate: (input) => (input.length ? true : 'Component entity name is required'),
        },
      ]);
      name = answer.name;
    }
    const entityName = this.formatName(name);
    const entitiesName = plural(entityName);
    const templateContext = { entityName, entitiesName };
    this.consoleService.info(`Create CRUD component for "${entityName}"...`);

    if (!this.fileService.fileDirExistsSync(realpath)) {
      throw new Error(
        `Unable to create CRUD component for "${entityName}" in unexisting directory "${realpath}`
      );
    }

    // Create main component
    const componentDirPath = await this.createComponent({
      realpath,
      name: plural(entityName),
      componentTemplate: 'crud/Crud.tsx',
      templateContext,
    });

    // Create config
    const configTemplateContext = {
      ...templateContext,
      uiPackage: await this.getUIPackage(realpath),
    };
    await this.templateService.renderTemplateTree(
      componentDirPath,
      CreateComponent.templateNamespace + '/crud',
      { [entitiesName + 'Config.tsx']: 'Config.tsx' },
      configTemplateContext
    );

    // Create child components
    const components = {
      Create: entityName,
      Delete: entityName,
      Update: entityName,
      Read: entityName,
      List: entitiesName,
    };

    for (const componentName of Object.keys(components)) {
      await this.createComponent({
        realpath,
        componentDirPath,
        name: componentName + components[componentName],
        componentTemplate: `crud/${componentName.toLowerCase()}/${componentName}.tsx`,
        templateContext,
      });
    }

    this.consoleService.success(`CRUD component for "${entityName}" has been created`);
  }

  protected formatName(name: string): string {
    return singular(super.formatName(name));
  }
}
