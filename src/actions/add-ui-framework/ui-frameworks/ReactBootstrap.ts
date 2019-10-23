import { injectable } from 'inversify';
import { resolve } from 'path';
import { IUIFrameworkAction } from './IUIFrameworkAction';
import { info, success } from '../../../plugins/Cli';
import { installPackages, hasDependency } from '../../../plugins/Package';
import { addInFile, replaceInFile } from '../../../plugins/File';
import { addTypescriptImports } from '../../../plugins/Typescript';

@injectable()
export default class ReactBootstrap implements IUIFrameworkAction {
    getName() {
        return 'React Bootstrap (https://react-bootstrap.github.io)';
    }

    async run({ realpath }) {

        const packageName = '@reactionable/ui-bootstrap';

        // Installs packages        
        info('Installs packages...');
        if (!hasDependency(realpath, packageName)) {
            await installPackages(realpath, [packageName]);
        }
        success('Packages have been installed in "' + realpath + '"');

        // Import style files
        info('Import style files...');
        const mainStyleFile = resolve(realpath, 'src/index.scss');
        addInFile(
            mainStyleFile,
            "\n" +
            '// Import Bootstrap and its default variables' + "\n" +
            '@import \'~bootstrap/scss/bootstrap.scss\';' + "\n" +
            "\n"
        );
        success('Style files have been imported in "' + mainStyleFile + '"');

        // Add UI components to existing App components
        info('Add UI components to existing components...');
        const appFile = resolve(realpath, 'src/App.tsx');
        addTypescriptImports(
            appFile,
            [
                { packageName, modules: { 'Loader': '' } }
            ]
        );
        replaceInFile(
            appFile,
            /LoaderComponent: undefined,.+$/,
            'LoaderComponent: Loader,'
        );
        success('UI components have been added to existing components');
    }
}