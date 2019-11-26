import { prompt } from 'inquirer';
import { basename, resolve, dirname } from 'path';
import { red } from 'chalk';
import { injectable, inject } from 'inversify';
import { IAction } from '../IAction';
import { error, success, info, exec, getNpmCmd } from '../../plugins/Cli';
import { replaceFileExtension, fileExistsSync, dirExistsSync } from '../../plugins/File';
import { installPackages, getPackageJsonPath, hasInstalledPackage, getPackageInfo } from '../../plugins/package/Package';
import { renderTemplateTree } from '../../plugins/template/Template';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddHosting from '../add-hosting/AddHosting';
import AddVersioning from '../add-versioning/AddVersioning';
import CreateComponent from '../create-component/CreateComponent';
import GenerateReadme from '../generate-readme/GenerateReadme';
import { mkdirSync } from 'fs';
import { FileFactory } from '../../plugins/file/FileFactory';

@injectable()
export default class CreateReactApp implements IAction {

    constructor(
        @inject(AddUIFramework) private addUIFramework: AddUIFramework,
        @inject(AddHosting) private addHosting: AddHosting,
        @inject(AddVersioning) private addVersioning: AddVersioning,
        @inject(CreateComponent) private createComponent: CreateComponent,
        @inject(GenerateReadme) private generateReadme: GenerateReadme,
    ) { }

    getName() {
        return 'Create a new react app';
    }

    async run({ realpath }) {
        const projectName = basename(realpath);

        let reactAppExistsAlready = false;
        if (dirExistsSync(realpath)) {
            const { override } = await prompt([
                {
                    type: 'confirm',
                    name: 'override',
                    message: 'Directory "' + realpath + '" exists already, ' + red('override it?'),
                },
            ]);
            if (!override) {
                return;
            }

            if (
                getPackageJsonPath(realpath)
                && hasInstalledPackage(realpath, 'react')
                && fileExistsSync(resolve(realpath, 'src/react-app-env.d.ts'))) {
                reactAppExistsAlready = true;
            }
        }
        else {
            const parentDir = dirname(realpath);
            if (!dirExistsSync(parentDir)) {
                error('Unable to create app "' + projectName + '", directory "' + parentDir + '" does not exist.');
                return;
            }
        }

        if (!reactAppExistsAlready) {
            const createReactAppCmd = getNpmCmd('create-react-app');
            if (!createReactAppCmd) {
                return error('Unable to create app, install globally "create-react-app" or "npx"');
            }

            // Create app
            info('Creating app...');
            await exec(createReactAppCmd + ' ' + realpath + ' --typescript', dirname(realpath));
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
        replaceFileExtension(resolve(realpath, 'src/App.css'), 'scss');

        await FileFactory
            .fromFile(resolve(realpath, 'src/index.tsx'))
            .replaceContent(/import '\.\/index\.css';/, 'import \'./index.scss\';')
            .saveFile();

        await FileFactory.fromFile(resolve(realpath, 'src/App.tsx'))
            .replaceContent(/import '\.\/App\.css';/, 'import \'./App.scss\';')
            .saveFile();

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
            'i18n',
            {
                [i18nPath]: [
                    'i18n.ts',
                    'locales/en/translation.json',
                ],
            },
            {
                projectName: JSON.stringify(getPackageInfo(realpath, 'name')),
            }
        );

        await FileFactory.fromFile(resolve(realpath, 'src/index.tsx'))
            .appendContent('import \'./i18n/i18n.ts\';', 'import \'./index.scss\';')
            .saveFile();

        success('I18n configuration has been created in "' + resolve(realpath, i18nPath) + '"');

        // Add UI framework
        await this.addUIFramework.run({ realpath });

        // Add Versioning
        await this.addVersioning.run({ realpath });

        // Add hosting
        await this.addHosting.run({ realpath });

        // Generate README
        await this.generateReadme.run({ realpath, mustPrompt: true });
    }

}