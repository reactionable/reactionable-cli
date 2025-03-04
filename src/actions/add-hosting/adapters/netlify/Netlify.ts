import { error, info } from "console";
import { resolve } from "path";

import { inject, injectFromBase } from "inversify";
import prompts from "prompts";

import { CliService } from "../../../../services/CliService";
import { ConsoleService } from "../../../../services/ConsoleService";
import { FileFactory } from "../../../../services/file/FileFactory";
import { FileService } from "../../../../services/file/FileService";
import { TomlFile } from "../../../../services/file/TomlFile";
import { GitService } from "../../../../services/git/GitService";
import { PackageManagerService } from "../../../../services/package-manager/PackageManagerService";
import { StringUtils } from "../../../../services/StringUtils";
import { TemplateService } from "../../../../services/template/TemplateService";
import { AbstractAdapterAction, AdapterActionOptions } from "../../../AbstractAdapterAction";
import { HostingAdapter } from "../HostingAdapter";

@injectFromBase()
export default class Netlify extends AbstractAdapterAction implements HostingAdapter {
  protected name = "Netlify (https://docs.netlify.com)";

  constructor(
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(FileService) private readonly fileService: FileService,
    @inject(TemplateService) private readonly templateService: TemplateService,
    @inject(CliService) private readonly cliService: CliService,
    @inject(GitService) private readonly gitService: GitService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(PackageManagerService)
    private readonly packageManagerService: PackageManagerService
  ) {
    super();
  }

  async isEnabled(realpath: string): Promise<boolean> {
    return this.fileService.fileExists(resolve(realpath, "netlify.toml"));
  }

  async run({ realpath }: AdapterActionOptions): Promise<void> {
    // Add netlify default configuration files
    info("Configure Netlify...");

    if (!this.cliService.getGlobalCmd("netlify")) {
      return error('Unable to configure Netlify, please install globally "@netlify/cli" or "npx"');
    }

    const { projectName } = await prompts([
      {
        type: "text",
        name: "projectName",
        initial: await this.packageManagerService.getPackageName(realpath, "hyphenize"),
        message: "Enter a name for the netlify application",
        format: (value) => StringUtils.hyphenize(value),
      },
    ]);

    const netlifyFilePath = resolve(realpath, "netlify.toml");

    const netlifyFile = await this.fileFactory.fromFile<TomlFile>(netlifyFilePath);
    netlifyFile.appendContent(
      await this.templateService.renderTemplateFile("add-hosting/netlify/netlify.toml", {
        nodeVersion: this.cliService.getNodeVersion(),
        projectBranch: await this.gitService.getGitCurrentBranch(realpath, "master"),
        projectPath: realpath,
        projectName,
      })
    );
    await netlifyFile.saveFile();

    // Configure netlify

    // Check if netlify is configured
    let netlifyConfig: { name: string } | undefined;
    let gitRemoteUrl = await this.gitService.getGitRemoteOriginUrl(realpath, false);
    if (gitRemoteUrl) {
      gitRemoteUrl = gitRemoteUrl.replace(/\.git$/, "");

      const sitesListData = await this.execNetlifyCmd(
        ["api", "listSites", "--data", JSON.stringify(JSON.stringify({ filter: "all" }))],
        realpath,
        true
      );
      const sitesList = JSON.parse(sitesListData);
      for (const site of sitesList) {
        let siteRepoUrl = site?.build_settings?.repo_url;
        if (!siteRepoUrl) {
          continue;
        }
        siteRepoUrl = siteRepoUrl.replace(/\.git$/, "");
        if (siteRepoUrl === gitRemoteUrl) {
          netlifyConfig = site;
          break;
        }
      }
    }

    if (netlifyConfig) {
      this.consoleService.success(`Netlify is already configured for site "${netlifyConfig.name}"`);
      return;
    }

    await this.execNetlifyCmd(["sites:create", "-n", projectName, "--with-ci"], realpath);

    this.consoleService.success(`Netlify has been configured in "${realpath}"`);
  }

  private execNetlifyCmd(args: string[], realpath: string, silent?: boolean) {
    const netlifyCmd = this.cliService.getGlobalCmd("netlify");
    if (!netlifyCmd) {
      throw new Error(
        'Unable to configure Netlify, please install globally "@netlify/cli" or "npx"'
      );
    }
    return this.cliService.execCmd([netlifyCmd, ...args], realpath, silent);
  }
}
