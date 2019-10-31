import { join, resolve } from 'path';
import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { IRealpathRunnable } from '../IRealpathRunnable';
import { renderTemplateTree } from '../../plugins/Template';
import { getPackageInfo } from '../../plugins/Package';
import { info, success } from '../../plugins/Cli';
import { existsSync } from 'fs';
import chalk from 'chalk';

@injectable()
export default class CreateComponent implements IRealpathRunnable<{ name: string | undefined }> {

    constructor() { }

    getName() {
        return 'Create a new react component';
    }

    async run({ realpath, name }) {
        if (!name) {
            const answer = await prompt<{name: string}>([
                {
                    name: 'name',
                    message: 'What\'s the component name?',
                    validate: input => (input.length ? true : `Component name is required`),
                },
            ]);
            name = answer.name;
        }

        name = name.charAt(0).toUpperCase() + name.slice(1);
        info(`Create component "${name}"...`);

        // Define component path
        let viewsPath = join('', 'src', 'views');
        let componentDirPath = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        
        if(realpath.indexOf(viewsPath) === -1){
            componentDirPath = join(viewsPath, componentDirPath);
        }
        let componentTemplate: string = 'component/simple/Simple.tsx';

        switch (name) {
            case 'App':
                componentDirPath = 'src';
                componentTemplate = 'component/app/App.tsx';
                break;
            case 'NotFound':
                componentTemplate = 'component/not-found/NotFound.tsx';
                break;
        }

        componentDirPath = resolve(componentDirPath);

        // Create component from template
        await renderTemplateTree(
            realpath,
            {
                [componentDirPath]: {
                    [name + '.tsx']: componentTemplate,
                    [name + '.test.tsx']: 'component/simple/Simple.test.tsx',
                },
            },
            {
                componentName: name,
                projectName: getPackageInfo(realpath, 'name'),
            }
        );
        success(`Component "${name}" has been created in "${componentDirPath}"`);
    }


}