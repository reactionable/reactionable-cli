import { injectable, inject } from 'inversify';
import { resolve } from 'path';
import { AbstractAdapterWithPackage } from '../../AbstractAdapterWithPackage';
import { TypescriptFile } from '../../../services/file/TypescriptFile';
import { FileFactory } from '../../../services/file/FileFactory';
import { info } from 'console';
import { ConsoleService } from '../../../services/ConsoleService';
import { PackageManagerService } from '../../../services/package-manager/PackageManagerService';
import { IUIFrameworkAdapter } from './IUIFrameworkAdapter';

@injectable()
export default class ReactBootstrap extends AbstractAdapterWithPackage
  implements IUIFrameworkAdapter {
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

  async run({ realpath }) {
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

    this.consoleService.success(
      `Style files have been imported in "${mainStyleFile}"`
    );

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

    this.consoleService.success(
      'UI components have been added to existing components'
    );
  }
}
