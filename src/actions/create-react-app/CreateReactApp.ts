import { which } from 'shelljs';
import { prompt } from 'inquirer';
import { existsSync } from 'fs';
import { basename, resolve, dirname } from 'path';
import chalk from 'chalk';
import { injectable, inject } from 'inversify';
import { error, success, info, exec } from '../../plugins/Cli';
import AddUIFramework from './add-ui-framework/AddUIFramework';
import AddHosting from './add-hosting/AddHosting';
import { IAction } from '../IAction';
import { replaceFileExtension, replaceInFile } from '../../plugins/File';
import AddVersioning from './add-versioning/AddVersioning';

@injectable()
export default class CreateReactApp implements IAction {

    constructor(
        @inject(AddUIFramework) private addUIFramework: AddUIFramework,
        @inject(AddHosting) private addHosting: AddHosting,
        @inject(AddVersioning) private addVersioning: AddVersioning,
    ) { }

    getName() {
        return 'Create a new react app';
    }

    async run() {
        const { projectDir } = await prompt([
            {
                name: 'projectDir',
                message: 'Where to create your new app (path)?',
            },
        ]);

        const realpath = resolve(projectDir);
        const projectName = basename(realpath);

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
        }
        else {
            const parentDir = dirname(realpath);
            if (!existsSync(parentDir)) {
                return error('Unable to create app "' + projectName + '", directory "' + parentDir + '" does not exist.');
            }
        }

        const createReactAppCmd = this.getCreateReactAppCmd();
        if (!createReactAppCmd) {
            return error('Unable to create app, install globally "create-react-app" or "npx"');
        }

        // Create app
        info('Creating app...');
        // exec(createReactAppCmd + ' ' + realpath + ' --typescript');
        // installPackages(realpath, ['@reactionable/reactionable']);
        success('App has been created in "' + realpath + '"');

        // Add Saas
        info('Adding Saas...');
        // installPackages(realpath, ['node-sass']);

        // Replace css files
        replaceFileExtension(realpath + '/src/index.css', 'scss');
        replaceInFile(realpath + '/src/index.tsx', 'import \'./index.css\';', 'import \'./index.scss\';');

        replaceFileExtension(realpath + '/src/App.css', 'scss');
        replaceInFile(realpath + '/src/App.tsx', 'import \'./App.css\';', 'import \'./App.scss\';');

        success('Saas has been added in "' + realpath + '"');

        // Add UI framework
        info('Adding UI framemork...');
        // await this.addUIFramework.run({ realpath });
        success('UI framemork has been added in "' + realpath + '"');

        // Add hosting
        info('Adding Hosting...');
        // await this.addHosting.run({ realpath });
        success('Hosting has been added in "' + realpath + '"');

        // Add Versioning
        info('Adding Versioning...');
        await this.addVersioning.run({ realpath });
        success('Versioning has been added in "' + realpath + '"');
    }

    getCreateReactAppCmd(): string | null {
        if (which('create-react-app')) {
            return 'create-react-app';
        }
        if (which('npx')) {
            return 'npx create-react-app';
        }
        return null;
    }


}