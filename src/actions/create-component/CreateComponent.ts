import { resolve } from 'path';
import { injectable } from 'inversify';
import { IRealpathRunnable } from '../IRealpathRunnable';

// Templates
import appComponentTemplate from './templates/App.tsx.template';
import notFoundComponentTemplate from './templates/NotFound.tsx.template';
import defaultComponentTemplate from './templates/Default.tsx.template';
import testComponentTemplate from './templates/Default.test.tsx.template';
import { renderTemplate } from '../../plugins/Template';
import { getPackageInfo } from '../../plugins/Package';

@injectable()
export default class CreateComponent implements IRealpathRunnable<{ name: string }> {

    constructor() { }

    getName() {
        return 'Create a new react component';
    }

    async run({ realpath, name }) {
        // Define component path
        let componentDirPath: string = 'src/views/' + name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        let componentTemplate: string = defaultComponentTemplate;

        switch (name) {
            case 'App':
                componentDirPath = 'src';
                componentTemplate = appComponentTemplate;
                break;
            case 'NotFound':
                componentTemplate = notFoundComponentTemplate;
                break;
        }

        // Create component from template
        await renderTemplate(
            realpath,
            {
                [componentDirPath]: {
                    [name + '.tsx']: componentTemplate,
                    [name + '.test.tsx']: testComponentTemplate,
                },
            },
            {
                componentName: name,
                projectName: getPackageInfo(realpath, 'name'),
            }
        )

    }


}