import { injectable } from 'inversify';
import { resolve } from 'path';
import { IAdapter } from '../../IAdapter';
import { info, success } from '../../../plugins/Cli';
import { installPackages, hasInstalledPackage } from '../../../plugins/package/Package';
import { safeReplaceFile, safeAppendFile } from '../../../plugins/File';
import { setTypescriptImports } from '../../../plugins/file/Typescript';
import { AbstractAdapterWithPackage } from '../../AbstractAdapterWithPackage';

@injectable()
export default class ReactBootstrap extends AbstractAdapterWithPackage {
    protected name = 'React Bootstrap (https://react-bootstrap.github.io)';
    protected packageName = '@reactionable/ui-bootstrap';


    async run({ realpath }) {
        await super.run({ realpath });

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
        await setTypescriptImports(
            appFile,
            [
                {
                    packageName: this.getPackageName(),
                    modules: {
                        'useUIContextProviderProps': '',
                        'IUIContextProviderProps': '',
                        'IUseLayoutProps': '',
                    },
                },
            ],
            [
                {
                    packageName: '@reactionable/core',
                    modules: {
                        'IUIContextProviderProps': '',
                        'IUseLayoutProps': '',
                    },
                },
            ]
        );
        await safeReplaceFile(
            appFile,
            /ui: undefined,.*$/m,
            'ui: useUIContextProviderProps(),'
        );
        success('UI components have been added to existing components');
    }
}