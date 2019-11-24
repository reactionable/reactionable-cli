import { join, resolve, dirname, basename } from 'path';
import { injectable, inject } from 'inversify';
import { prompt } from 'inquirer';
import { IAction } from '../IAction';
import { renderTemplateTree } from '../../plugins/template/Template';
import { getPackageInfo } from '../../plugins/package/Package';
import { info, success } from '../../plugins/Cli';
import AddUIFramework from '../add-ui-framework/AddUIFramework';
import AddHosting from '../add-hosting/AddHosting';

@injectable()
export default class CreateComponent implements IAction<{
    name: string | undefined,
}> {

    protected static defaultPackage = '@reactionable/core';
    protected static viewsPath = join('', 'src', 'views');
    protected static templateNamespace = 'create-component';

    constructor(
        @inject(AddUIFramework) private addUIFramework: AddUIFramework,
        @inject(AddHosting) private addHosting: AddHosting,
    ) { }

    getName() {
        return 'Create a new react component';
    }

    async run({
        realpath,
        name,
    }) {
        if (!name) {
            const answer = await prompt<{ name: string }>([
                {
                    name: 'name',
                    message: 'What\'s the component name?',
                    validate: input => (input.length ? true : `Component name is required`),
                },
            ]);
            name = answer.name;
        }

        name = this.formatName(name);
        info(`Create component "${name}"...`);

        const componentDirPath = await this.createComponent({ realpath, name });

        success(`Component "${name}" has been created in "${componentDirPath}"`);
    }

    async createComponent({
        realpath,
        name,
        componentTemplate = 'simple/Simple.tsx',
        testComponentTemplate = 'simple/Simple.test.tsx',
        templateContext = {},
    }): Promise<string> {
        // Define component path
        let componentDirName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        let componentDirPath: string;
        if (realpath.indexOf(CreateComponent.viewsPath) === -1) {
            componentDirPath = resolve(realpath, CreateComponent.viewsPath, componentDirName);
        }
        else {
            componentDirPath = resolve(realpath, componentDirName);
        }

        switch (name) {
            case 'App':
                componentDirPath = 'src';
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
            projectName: getPackageInfo(this.getProjectRootPath(realpath), 'name'),
            uiPackage: await this.getUIPackage(realpath),
            hostingPackage: await this.getHostingPackage(realpath),
        }

        // Create component from template
        await renderTemplateTree(
            dirname(componentDirPath),
            CreateComponent.templateNamespace,
            {
                [basename(componentDirPath)]: {
                    [name + '.tsx']: componentTemplate,
                    [name + '.test.tsx']: testComponentTemplate,
                },
            },
            context,
        );
        return componentDirPath;
    }

    formatName(name: string): string {
        name = name.replace(/\W+(.)/g, (match, chr) => chr.toUpperCase());
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    async getUIPackage(realpath: string): Promise<string> {
        const uiPackage = (await this.addUIFramework.detectAdapter(this.getProjectRootPath(realpath)))?.getPackageName();
        if (uiPackage) {
            return uiPackage;
        }
        return CreateComponent.defaultPackage;
    }

    async getHostingPackage(realpath: string): Promise<string> {
        const hostingPackage = (await this.addHosting.detectAdapter(this.getProjectRootPath(realpath)))?.getPackageName();
        if (hostingPackage) {
            return hostingPackage;
        }
        return CreateComponent.defaultPackage;
    }

    getProjectRootPath(realpath: string): string {
        let projectRootPath: string;
        if (realpath.indexOf(CreateComponent.viewsPath) === -1) {
            projectRootPath = realpath;
        }
        else {
            projectRootPath = realpath.split(CreateComponent.viewsPath)[0];
        }
        return projectRootPath;
    }

}