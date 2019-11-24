import { plural, singular } from 'pluralize';
import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { info, success } from '../../plugins/Cli';
import CreateComponent from './CreateComponent';
import { renderTemplateTree } from '../../plugins/template/Template';

@injectable()
export default class CreateCrudComponent extends CreateComponent {

    getName() {
        return 'Create a new react CRUD component';
    }

    async run({ realpath, name }) {
        if (!name) {
            const answer = await prompt<{ name: string }>([
                {
                    name: 'name',
                    message: 'What\'s the component entity name?',
                    validate: input => (input.length ? true : `Component entity name is required`),
                },
            ]);
            name = answer.name;
        }

        const entityName = this.formatName(name);
        const entitiesName = plural(entityName);
        const templateContext = { entityName, entitiesName };

        info(`Create CRUD component for "${entityName}"...`);

        // Create main component
        const componentDirPath = await this.createComponent({
            realpath,
            name: plural(entityName),
            componentTemplate: 'crud/Crud.tsx',
            templateContext,
        });

        // Create config
        await renderTemplateTree(
            componentDirPath,
            CreateComponent.templateNamespace + '/crud',
            {
                [entitiesName + 'Config.tsx']: 'Config.tsx',
            },
            { ...templateContext, uiPackage: await this.getUIPackage(realpath) }
        );

        // Create child components
        const components = {
            'Create': entityName,
            'Delete': entityName,
            'Update': entityName,
            'Read': entityName,
            'List': entitiesName,
        };
        for (const componentName of Object.keys(components)) {
            await this.createComponent({
                realpath: componentDirPath,
                name: componentName + components[componentName],
                componentTemplate: `crud/${componentName.toLowerCase()}/${componentName}.tsx`,
                templateContext,
            });
        }
        success(`CRUD component for "${entityName}" has been created`);
    }

    formatName(name: string): string {
        return singular(super.formatName(name));
    }

}