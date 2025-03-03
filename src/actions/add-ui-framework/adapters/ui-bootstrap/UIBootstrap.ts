import { resolve } from "path";

import { AdapterWithPackageActionOptions } from "../../../AbstractAdapterWithPackageAction";
import { AbstractUIFrameworkAdapter } from "../UIFrameworkAdapter";
import { injectFromBase } from "inversify";

@injectFromBase()
export default class UIBootstrap extends AbstractUIFrameworkAdapter {
  protected name = "UI Bootstrap (React Bootstrap)";
  protected adapterPackageName = "@reactionable/ui-bootstrap";

  async run({ realpath }: AdapterWithPackageActionOptions): Promise<void> {
    await super.run({ realpath });

    // Import style files
    this.consoleService.info("Import style files...");
    const mainStyleFilePath = resolve(realpath, "src/index.scss");

    const mainStyleFile = await this.fileFactory.fromFile(mainStyleFilePath);
    mainStyleFile.appendContent(
      `// Import Bootstrap and its default variables
@import '~bootstrap/scss/bootstrap.scss';
`
    );
    await mainStyleFile.saveFile();

    this.consoleService.success(`Style files have been imported in "${mainStyleFilePath}"`);
  }
}
