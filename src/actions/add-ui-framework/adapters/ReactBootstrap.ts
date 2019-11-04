import { injectable } from 'inversify';
import { resolve } from 'path';
import { IAdapter } from '../../IAdapter';
import { info, success } from '../../../plugins/Cli';
import { installPackages, getPackageInfo } from '../../../plugins/Package';
import { safeReplaceFile, safeAppendFile } from '../../../plugins/File';
import { setTypescriptImports } from '../../../plugins/Typescript/Typescript';

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
        await setTypescriptImports(
            appFile,
            [
                {
                    packageName,
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

        const projectName = getPackageInfo(realpath, 'name');
        await safeReplaceFile(
            appFile,
            /layout: \{\},.*$/m,
            `layout: {
    header: {
      brand: ${JSON.stringify(projectName)},
    },
    footer: {
      brand: ${JSON.stringify(projectName)},
    },
  },`);
        success('UI components have been added to existing components');
    }
}