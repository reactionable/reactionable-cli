import { prompt } from 'inquirer';
import { existsSync } from 'fs';
import { basename, resolve, dirname } from 'path';
import chalk from 'chalk';
import { injectable, inject } from 'inversify';
import { error, success, info, exec, getCmd } from '../../plugins/Cli';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddHosting from '../add-hosting/AddHosting';
import { IAction } from '../IAction';
import { replaceFileExtension, replaceInFile } from '../../plugins/File';
import AddVersioning from '../add-versioning/AddVersioning';
import { installPackages, hasDependency, getPackageJson } from '../../plugins/Package';
import CreateComponent from '../create-component/CreateComponent';

@injectable()
export default class CreateReactApp implements IAction {

    constructor(
        @inject(AddUIFramework) private addUIFramework: AddUIFramework,
        @inject(AddHosting) private addHosting: AddHosting,
        @inject(AddVersioning) private addVersioning: AddVersioning,
        @inject(CreateComponent) private createComponent: CreateComponent,
    ) { }

    getName() {
        return 'Create a new react app';
    }

    async run({ name }) {
        const { projectDir } = await prompt([
            {
                name: 'projectDir',
                message: 'Where to create your new app (path)?',
            },
        ]);

        const realpath = resolve(projectDir);
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
                && hasDependency(realpath, 'react')
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

        if (!hasDependency(realpath, '@reactionable/core')) {
            info('Installing dependencies...');
            await installPackages(realpath, ['@reactionable/core']);
            success('Dependencies have been installed');
        }

        // Add Saas
        info('Adding Saas...');

        if (!hasDependency(realpath, 'node-sass')) {
            await installPackages(realpath, ['node-sass']);
        }

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