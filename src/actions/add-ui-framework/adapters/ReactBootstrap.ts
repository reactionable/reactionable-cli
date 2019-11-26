import { injectable } from 'inversify';
import { resolve } from 'path';
import { info, success } from '../../../plugins/Cli';
import { AbstractAdapterWithPackage } from '../../AbstractAdapterWithPackage';
import { FileFactory } from '../../../plugins/file/FileFactory';
import { TypescriptFile } from '../../../plugins/file/TypescriptFile';

@injectable()
export default class ReactBootstrap extends AbstractAdapterWithPackage {
    protected name = 'React Bootstrap (https://react-bootstrap.github.io)';
    protected packageName = '@reactionable/ui-bootstrap';


    async run({ realpath }) {
        await super.run({ realpath });

        // Import style files
        info('Import style files...');
        const mainStyleFile = resolve(realpath, 'src/index.scss');

        await FileFactory.fromFile(mainStyleFile).appendContent(
            '// Import Bootstrap and its default variables' + "\n" +
            '@import \'~bootstrap/scss/bootstrap.scss\';' + "\n"
        ).saveFile();

        success('Style files have been imported in "' + mainStyleFile + '"');

        // Add UI components to existing App components
        info('Add UI components to existing components...');
        const appFile = resolve(realpath, 'src/App.tsx');
        await FileFactory.fromFile<TypescriptFile>(appFile).setImports(
            [{
                packageName: this.getPackageName(),
                modules: {
                    'useUIContextProviderProps': '',
                    'IUIContextProviderProps': '',
                    'IUseLayoutProps': '',
                },
            }],
            [{
                packageName: '@reactionable/core',
                modules: {
                    'IUIContextProviderProps': '',
                    'IUseLayoutProps': '',
                },
            }])
            .replaceContent(/ui: undefined,.*$/m, 'ui: useUIContextProviderProps(),')
            .saveFile();

        success('UI components have been added to existing components');
    }
}