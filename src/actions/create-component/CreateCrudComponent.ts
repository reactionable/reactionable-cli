import { join, resolve } from 'path';

import { injectable } from 'inversify';
import { plural, singular } from 'pluralize';
import prompts from 'prompts';

import { TypescriptFile } from '../../services/file/TypescriptFile';
import { TypescriptImport } from '../../services/file/TypescriptImport';
import { StringUtils } from '../../services/StringUtils';
import CreateComponent, { CreateComponentOptions } from './CreateComponent';

@injectable()
export default class CreateCrudComponent extends CreateComponent {
  getName(): string {
    return 'Create a new CRUD component';
  }

  async run({ realpath, name }: CreateComponentOptions): Promise<void> {
    if (!name) {
      const answer = await prompts([
        {
          type: 'text',
          name: 'name',
          message: "What's the component entity name?",
          format: (input) => (input.length ? true : 'Component entity name is required'),
        },
      ]);
      name = answer.name as string;
    }
    const entityName = this.formatName(name);
    const entitiesName = plural(entityName);
    this.consoleService.info(`Create CRUD component for "${entityName}"...`);

    if (!this.fileService.fileDirExistsSync(realpath)) {
      throw new Error(
        `Unable to create CRUD component for "${entityName}" in unexisting directory "${realpath}`
      );
    }

    const templateContext = {
      entityName,
      entitiesName,
      uiPackage: await this.getUIPackage(realpath),
    };

    // Create main component
    const componentDirPath = await this.createComponent({
      realpath,
      name: entitiesName,
      componentTemplate: 'crud/Crud.tsx',
      templateContext,
    });

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

    // Create config
    const namespace = join(CreateComponent.templateNamespace, 'crud');
    const i18nPath = join((await this.getCreateAppAdapter(realpath)).getLibDirectoryPath(), 'i18n');
    await this.templateService.renderTemplate(realpath, namespace, {
      componentDirPath,
      i18nPath,
      ...templateContext,
    });

    // Import and add translations as i18n ressources
    const i18nFilepath = resolve(realpath, i18nPath, 'i18n.ts');
    const translationNamespace = StringUtils.camelize(entitiesName);
    await this.fileFactory
      .fromFile<TypescriptFile>(i18nFilepath)
      .setImports([
        {
          packageName: `./locales/en/${translationNamespace}.json`,
          modules: { [`en${entitiesName}`]: TypescriptImport.defaultImport },
        },
        {
          packageName: `./locales/fr/${translationNamespace}.json`,
          modules: { [`fr${entitiesName}`]: TypescriptImport.defaultImport },
        },
      ])
      .appendContent(`    ${translationNamespace}: en${entitiesName},`, '    common: enCommon,')
      .appendContent(`    ${translationNamespace}: fr${entitiesName},`, '    common: frCommon,')
      .saveFile();

    this.consoleService.success(`CRUD component for "${entityName}" has been created`);
  }

  protected formatName(name: string): string {
    return singular(super.formatName(name));
  }
}
