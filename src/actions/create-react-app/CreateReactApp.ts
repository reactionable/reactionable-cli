import { prompt } from 'inquirer';
import { existsSync } from 'fs';
import { basename, resolve, dirname } from 'path';
import chalk from 'chalk';
import { injectable, inject } from 'inversify';
import { IRealpathRunnable } from '../IRealpathRunnable';
import { error, success, info, exec, getCmd } from '../../plugins/Cli';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddHosting from '../add-hosting/AddHosting';
import { replaceFileExtension, replaceInFile, addInFile } from '../../plugins/File';
import {  renderTemplateTree } from '../../plugins/Template';
import AddVersioning from '../add-versioning/AddVersioning';
import { installPackages, getPackageJson, hasInstalledPackage, getPackageInfo } from '../../plugins/Package';
import CreateComponent from '../create-component/CreateComponent';

@injectable()
export default class CreateReactApp implements IRealpathRunnable {

    constructor(
        @inject(AddUIFramework) private addUIFramework: AddUIFramework,
        @inject(AddHosting) private addHosting: AddHosting,
        @inject(AddVersioning) private addVersioning: AddVersioning,
        @inject(CreateComponent) private createComponent: CreateComponent,
    ) { }

    getName() {
        return 'Create a new react app';
    }

    async run({ realpath }) {
        const projectName = basename(realpath);

        let reactAppExistsAlready = false;
        if (existsSync(realpath)) {
            const { override } = await prompt([
                {
                    type: 'confirm',
                    name: 'override',
                    message: 'Directory "' + realpath + '" exists already, ' + chalk.red('override it?'),
                },
            ]);
            if (!override) {
                return;
            }

            if (
                getPackageJson(realpath)
                && hasInstalledPackage(realpath, 'react')
                && existsSync(resolve(realpath, 'src/react-app-env.d.ts'))) {
                reactAppExistsAlready = true;
            }
        }
        else {
            const parentDir = dirname(realpath);
            if (!existsSync(parentDir)) {
                error('Unable to create app "' + projectName + '", directory "' + parentDir + '" does not exist.');
                return;
            }
        }

        if (!reactAppExistsAlready) {
            const createReactAppCmd = getCmd('create-react-app');
            if (!createReactAppCmd) {
                return error('Unable to create app, install globally "create-react-app" or "npx"');
            }

            // Create app
            info('Creating app...');
            await exec(createReactAppCmd + ' ' + realpath + ' --typescript');
            success('App has been created in "' + realpath + '"');
        }

        await installPackages(realpath, [
            '@reactionable/core',
            '@types/react-helmet',
            '@types/react-router-dom',
            '@types/yup',
        ]);

        // Add Saas
        info('Adding Saas...');
        await installPackages(realpath, ['node-sass']);

        // Replace css files
        replaceFileExtension(resolve(realpath, 'src/index.css'), 'scss');
        replaceInFile(resolve(realpath, 'src/index.tsx'), 'import \'./index.css\';', 'import \'./index.scss\';');

        replaceFileExtension(resolve(realpath, 'src/App.css'), 'scss');
        replaceInFile(resolve(realpath, 'src/App.tsx'), 'import \'./App.css\';', 'import \'./App.scss\';');

        success('Saas has been added in "' + realpath + '"');

        // Create app components
        info('Create components...');
        await this.createComponent.run({ realpath, name: 'App' });
        await this.createComponent.run({ realpath, name: 'NotFound' });
        await this.createComponent.run({ realpath, name: 'Home' });
        success('Components have been created in "' + realpath + '"');

        // Add i18n config
        info('Add i18n configuration...');
        const i18nPath = 'src/i18n';
        await renderTemplateTree(
            realpath,
            {
                [i18nPath]: {
                    'i18n.ts': 'i18n/i18n.ts',
                    'locales/en/translation.json': 'i18n/translation.json',
                },
            },
            {
                projectName: JSON.stringify(getPackageInfo(realpath, 'name')),
            }
        );
        addInFile(
            resolve(realpath, 'src/index.tsx'),
            'import \'./i18n/i18n.ts\';',            
            'import \'./index.scss\';',
        );
        success('I18n configuration has been created in "' + resolve(realpath, i18nPath) + '"');

        // Add UI framework
        info('Adding UI framemork...');
        await this.addUIFramework.run({ realpath });
        success('UI framemork has been added in "' + realpath + '"');

        // Add Versioning
        info('Adding Versioning...');
        await this.addVersioning.run({ realpath });
        success('Versioning has been added in "' + realpath + '"');

        // Add hosting
        info('Adding Hosting...');
        await this.addHosting.run({ realpath });
        success('Hosting has been added in "' + realpath + '"');
    }

}