import { injectable } from 'inversify';
import { resolve } from 'path';
import { IUIFrameworkAction } from './IUIFrameworkAction';
import { info, success } from '../../../../plugins/Cli';
import { installPackages } from '../../../../plugins/Package';
import { addInFile } from '../../../../plugins/File';

@injectable()
export default class ReactBootstrap implements IUIFrameworkAction {
    getName() {
        return 'React Bootstrap (https://react-bootstrap.github.io)';
    }

    async run({ realpath }) {
        // Installs packages        
        info('Installs packages...');
        installPackages(realpath, ['react-bootstrap', 'bootstrap']);
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
    }
}