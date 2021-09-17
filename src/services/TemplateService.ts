import { dirname, extname, join, resolve, sep } from "path";

import { SafeString, compile, partials, registerHelper, registerPartial } from "handlebars";
import { inject, injectable } from "inversify";
import { plural, singular } from "pluralize";

import { FileFactory } from "./file/FileFactory";
import { FileService } from "./file/FileService";
import { StringUtils } from "./StringUtils";

// Compile template
registerHelper({
  and: (...parts) => {
    return Array.prototype.slice.call(parts, 0, parts.length - 1).every(Boolean);
  },
  eq: (v1, v2) => {
    return v1 === v2;
  },
  neq: (v1, v2) => {
    return v1 !== v2;
  },
  lt: (v1, v2) => {
    return v1 < v2;
  },
  gt: (v1, v2) => {
    return v1 > v2;
  },
  capitalize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return StringUtils.capitalize(str);
  },
  decapitalize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  pluralize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return plural(str);
  },
  singularize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return singular(str);
  },
  hyphenize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return StringUtils.hyphenize(str);
  },
  camelize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return StringUtils.camelize(str);
  },
  decamelize: (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return StringUtils.decamelize(str);
  },
  halfSplit: (array) => {
    if (!Array.isArray(array)) {
      return array;
    }
    // Split ranks steps in two parts
    const tmpArray = array;
    const halfWayThough = Math.floor(array.length / 2);
    return [tmpArray.slice(0, halfWayThough), tmpArray.slice(halfWayThough, tmpArray.length)];
  },
  inline(options) {
    const inline = compile(options.fn(this))(options.data.root);
    const nl2br = inline.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1<br>$2");
    return new SafeString(nl2br);
  },
  with(context, options) {
    return options.fn(context);
  },
});

type TemplateConfigItem = string[] | TemplateConfig | string;

export type TemplateConfig = {
  [key: string]: TemplateConfigItem;
};

export type TemplateContext = Record<string, unknown>;
type CompiledTemplate = (context: TemplateContext) => string;

@injectable()
export class TemplateService {
  private readonly compiledTemplates: Map<string, CompiledTemplate> = new Map();

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory
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

  /**
   * Render the template file(s) form given config
   */
  protected async renderTemplateFromConfig(
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
    const templateContent = await this.getTemplateFileContent(templateKey);
    const content = await this.renderTemplateString(templateContent, context);
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

    const fileContent = await this.renderTemplateFile(templateKey, context);

    await this.fileFactory.fromString(fileContent, filePath, encoding).saveFile();
  }

  async getTemplateFileContent(template: string): Promise<string> {
    const fileExt = extname(__filename);
    const templatePath = join(__dirname, "./../templates", template + ".template" + fileExt);
    if (!this.fileService.fileExistsSync(templatePath)) {
      throw new Error(`Template file "${templatePath}" does not exist`);
    }

    let templateContent: string;
    try {
      const importedContent = await import(templatePath);
      if ("string" === typeof importedContent) {
        templateContent = importedContent;
      } else if (
        "object" === typeof importedContent &&
        "string" === typeof importedContent.default
      ) {
        templateContent = importedContent.default;
      } else {
        throw new Error(
          `Unexpected content retrieved from importing template file "${templatePath}": ${typeof importedContent}`
        );
      }
    } catch (error) {
      throw new Error(
        `An error occurred while importing template file "${templatePath}": ${
          error instanceof Error ? error.message : error
        }`
      );
    }

    // Register partials if any
    const regex = /\{\{#> ([a-zA-Z]+) \}\}/gim;
    let matches;
    while ((matches = regex.exec(templateContent)) !== null) {
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      const partialName: string = matches[1];

      if (partials[partialName]) {
        continue;
      }

      const partialTemplateKey = `${template.split(sep)[0]}/partials/${partialName}`;
      const partialTmplateContent = await this.getTemplateFileContent(partialTemplateKey);

      registerPartial(partialName, partialTmplateContent);
    }

    return templateContent;
  }

  async getCompiledTemplateString(
    templateKey: string,
    templateContent: string
  ): Promise<CompiledTemplate> {
    let compiledTemplate = this.compiledTemplates.get(templateKey);
    if (compiledTemplate) {
      return compiledTemplate;
    }
    compiledTemplate = compile(templateContent, { strict: true });

    this.compiledTemplates.set(templateKey, compiledTemplate);

    return compiledTemplate;
  }

  async renderTemplateString(template: string, context: TemplateContext): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateString(template, template);
    try {
      return compiledTemplate(context);
    } catch (error) {
      throw new Error(
        `An error occurred while compiling template "${template}": ${
          error instanceof Error
            ? error.message.replace("[object Object]", JSON.stringify(context))
            : error
        }`
      );
    }
  }

  async getCompiledTemplateFile(templateKey: string): Promise<CompiledTemplate> {
    let compiledTemplate = this.compiledTemplates.get(templateKey);
    if (compiledTemplate) {
      return compiledTemplate;
    }

    const templateFileContent = await this.getTemplateFileContent(templateKey);
    try {
      compiledTemplate = compile(templateFileContent);

      this.compiledTemplates.set(templateKey, compiledTemplate);

      return compiledTemplate;
    } catch (error) {
      throw new Error(`An error occurred while compiling template "${templateKey}": ${error}`);
    }
  }

  async renderTemplateFile(templateKey: string, context: TemplateContext): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateFile(templateKey);
    try {
      const content = compiledTemplate(context);
      return content;
    } catch (error) {
      throw new Error(`An error occurred while rendering template "${templateKey}": ${error}`);
    }
  }
}
