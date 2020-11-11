import { info } from 'console';
import { resolve } from 'path';

import { inject, injectable } from 'inversify';

import { ConsoleService } from '../../../services/ConsoleService';
import { FileFactory } from '../../../services/file/FileFactory';
import { TypescriptFile } from '../../../services/file/TypescriptFile';
import { PackageManagerService } from '../../../services/package-manager/PackageManagerService';
import {
  AbstractAdapterWithPackageAction,
  AdapterWithPackageActionOptions,
} from '../../AbstractAdapterWithPackageAction';
import { UIFrameworkAdapter } from './UIFrameworkAdapter';

@injectable()
export default class ReactBootstrap
  extends AbstractAdapterWithPackageAction
  implements UIFrameworkAdapter {
  protected name = 'React Bootstrap (https://react-bootstrap.github.io)';
  protected adapterPackageName = '@reactionable/ui-bootstrap';

  constructor(
    @inject(PackageManagerService)
    packageManagerService: PackageManagerService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(ConsoleService) private readonly consoleService: ConsoleService
  ) {
    super(packageManagerService);
  }

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Import style files
    info('Import style files...');
    const mainStyleFile = resolve(realpath, 'src/index.scss');

    await this.fileFactory
      .fromFile(mainStyleFile)
      .appendContent(
        `// Import Bootstrap and its default variables
@import '~bootstrap/scss/bootstrap.scss';
`
      )
      .saveFile();

    this.consoleService.success(`Style files have been imported in "${mainStyleFile}"`);

    // Add UI components to existing App components
    info('Add UI components to existing components...');
    const appFile = resolve(realpath, 'src/App.tsx');
    await this.fileFactory
      .fromFile<TypescriptFile>(appFile)
      .setImports(
        [
          {
            packageName: this.getAdapterPackageName(),
            modules: {
              IAppProps: '',
              useUIContextProviderProps: '',
            },
          },
        ],
        [
          {
            packageName: '@reactionable/core',
            modules: {
              IUIContextProviderProps: '',
              IUseLayoutProps: '',
              IAppProps: '',
            },
          },
        ]
      )
      .replaceContent(/ui: undefined,.*$/m, 'ui: useUIContextProviderProps(),')
      .saveFile();

    this.consoleService.success('UI components have been added to existing components');
  }
}
