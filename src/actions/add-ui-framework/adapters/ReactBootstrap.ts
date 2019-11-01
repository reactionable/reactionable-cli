import { injectable } from 'inversify';
import { resolve } from 'path';
import { IAdapter } from '../../IAdapter';
import { info, success } from '../../../plugins/Cli';
import { installPackages } from '../../../plugins/Package';
import { safeReplaceFile, safeAppendFile } from '../../../plugins/File';
import { addTypescriptImports } from '../../../plugins/Typescript';

@injectable()
export default class ReactBootstrap implements IAdapter {
    getName() {
        return 'React Bootstrap (https://react-bootstrap.github.io)';
    }

    async run({ realpath }) {

        const packageName = '@reactionable/ui-bootstrap';

        // Installs packages
        await installPackages(realpath, [packageName]);

        // Import style files
        info('Import style files...');
        const mainStyleFile = resolve(realpath, 'src/index.scss');

        await safeAppendFile(
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
        await addTypescriptImports(
            appFile,
            [
                { packageName, modules: { 'Loader': '' } }
            ]
        );
        await safeReplaceFile(
            appFile,
            /LoaderComponent: undefined,.+$/,
            'LoaderComponent: Loader,'
        );
        success('UI components have been added to existing components');
    }
}