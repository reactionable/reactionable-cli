import { resolve } from "path";

import { injectable } from "inversify";

import { AdapterWithPackageActionOptions } from "../../AbstractAdapterWithPackageAction";
import { AbstractUIFrameworkAdapter } from "./UIFrameworkAdapter";

@injectable()
export default class UIBootstrap extends AbstractUIFrameworkAdapter {
  protected name = "UI Bootstrap (React Bootstrap)";
  protected adapterPackageName = "@reactionable/ui-bootstrap";

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Import style files
    this.consoleService.info("Import style files...");
    const mainStyleFile = resolve(realpath, "src/index.scss");

    await this.fileFactory
      .fromFile(mainStyleFile)
      .appendContent(
        `// Import Bootstrap and its default variables
@import '~bootstrap/scss/bootstrap.scss';
`
      )
      .saveFile();

    this.consoleService.success(`Style files have been imported in "${mainStyleFile}"`);
  }
}
