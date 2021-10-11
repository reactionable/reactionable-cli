import { dirname, extname, join, resolve } from "path";

import { inject, injectable } from "inversify";

import { FileFactory } from "../file/FileFactory";
import { FileService } from "../file/FileService";
import { TemplateAdapter } from "./adapters/TemplateAdapter";
import { AdapterKey } from "./container";
import { TemplateContext } from "./TemplateContext";
import { TemplateFileService } from "./TemplateFileService";

type TemplateConfigItem = string[] | TemplateConfig | string;

export type TemplateConfig = {
  [key: string]: TemplateConfigItem;
};

@injectable()
export class TemplateService {
  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory,
    @inject(TemplateFileService) private readonly templateFileService: TemplateFileService,
    @inject(AdapterKey) private readonly templateAdapter: TemplateAdapter
  ) {}

  async renderTemplate(
    dirPath: string,
    namespace: string,
    context: TemplateContext = {}
  ): Promise<void> {
    this.fileService.assertDirExists(dirPath);

    const config: TemplateConfig = await this.getTemplateConfig(namespace, context);
    return this.renderTemplateFromConfig(dirPath, namespace, context, config);
  }

  async renderTemplateFile(templateKey: string, context: TemplateContext): Promise<string> {
    return this.templateAdapter.renderTemplateFile(templateKey, context);
  }

  /**
   * Render the template file(s) form given config
   */
  private async renderTemplateFromConfig(
    dirPath: string,
    namespace: string,
    context: TemplateContext,
    config: TemplateConfigItem
  ): Promise<void> {
    if (Array.isArray(config)) {
      for (const filePath of config) {
        await this.renderTemplateFromConfig(dirPath, namespace, context, filePath);
      }
      return;
    }

    if (typeof config === "object") {
      for (const dir of Object.keys(config)) {
        const currentPath = resolve(dirPath, dir);
        await this.renderTemplateFromConfig(currentPath, namespace, context, config[dir]);
      }
      return;
    }

    const currentNamespace = join(namespace, config);
    const currentPath = extname(dirPath) ? dirPath : join(dirPath, config);
    const currentBaseDirPath = dirname(currentPath);

    if (!this.fileService.dirExistsSync(currentBaseDirPath)) {
      this.fileService.mkdirSync(currentBaseDirPath, true);
    }

    const templateKey = this.getTemplateKey(dirPath, currentPath, currentNamespace);

    await this.createFileFromTemplate(currentPath, templateKey, context);
  }

  async getTemplateConfig(namespace: string, context: TemplateContext): Promise<TemplateConfig> {
    const templateKey = join(namespace, "config");
    const templateContent = await this.templateFileService.getTemplateFileContent(templateKey);
    const content = await this.templateAdapter.renderTemplateString(templateContent, context);
    const templateConfig = JSON.parse(content);
    return templateConfig;
  }

  getTemplateKey(dirPath: string, filepath: string, namespace: string): string {
    // Namespace is the template key
    if (extname(namespace)) {
      return namespace;
    }

    const templateKey = join(namespace, filepath.replace(dirPath, ""));
    const templatePath = join(__dirname, "./../templates", templateKey + ".template");
    if (!this.fileService.fileExistsSync(templatePath)) {
      throw new Error(`Template file "${templatePath}" does not exist`);
    }

    return templateKey;
  }

  async createFileFromTemplate(
    filePath: string,
    templateKey: string,
    context: TemplateContext,
    encoding: BufferEncoding = "utf8"
  ): Promise<void> {
    const parentDir = dirname(filePath);
    if (!this.fileService.dirExistsSync(parentDir)) {
      throw new Error(
        `Unable to create file "${filePath}", directory "${parentDir}" does not exist`
      );
    }

    const fileContent = await this.templateAdapter.renderTemplateFile(templateKey, context);

    await this.fileFactory.fromString(fileContent, filePath, encoding).saveFile();
  }
}
