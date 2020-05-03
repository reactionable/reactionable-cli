import { mkdirSync } from 'fs';
import { resolve, dirname, join, basename, extname, sep } from 'path';
import { plural, singular } from 'pluralize';
import {
  compile,
  registerHelper,
  SafeString,
  registerPartial,
  partials,
} from 'handlebars';
import { inject, injectable } from 'inversify';
import { FileService } from './file/FileService';
import { FileFactory } from './file/FileFactory';
import { StringUtils } from './StringUtils';

// Compile template
registerHelper({
  and: (...parts) => {
    return Array.prototype.slice
      .call(parts, 0, parts.length - 1)
      .every(Boolean);
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
    if (typeof str !== 'string') {
      return str;
    }
    return StringUtils.capitalize(str);
  },
  decapitalize: (str) => {
    if (typeof str !== 'string') {
      return str;
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  pluralize: (str) => {
    if (typeof str !== 'string') {
      return str;
    }
    return plural(str);
  },
  singularize: (str) => {
    if (typeof str !== 'string') {
      return str;
    }
    return singular(str);
  },
  hyphenize: (str) => {
    if (typeof str !== 'string') {
      return str;
    }
    return StringUtils.hyphenize(str);
  },
  camelize: (str) => {
    if (typeof str !== 'string') {
      return str;
    }
    return StringUtils.camelize(str);
  },
  decamelize: (str) => {
    if (typeof str !== 'string') {
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
    return [
      tmpArray.slice(0, halfWayThough),
      tmpArray.slice(halfWayThough, tmpArray.length),
    ];
  },
  inline(options) {
    const inline = compile(options.fn(this))(options.data.root);
    const nl2br = inline.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
    return new SafeString(nl2br);
  },
  with(context, options) {
    return options.fn(context);
  },
});

export type TemplateConfig =
  | string[]
  | {
      [key: string]: TemplateConfig | string;
    };

type CompiledTemplate = (context: Object) => string;

@injectable()
export class TemplateService {
  private readonly compiledTemplates: Map<string, CompiledTemplate> = new Map();

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileFactory) private readonly fileFactory: FileFactory
  ) {}

  async renderTemplateTree(
    dirPath: string,
    namespace: string,
    config: TemplateConfig,
    context: Object = {}
  ): Promise<void> {
    this.fileService.assertDirExists(dirPath);

    if (Array.isArray(config)) {
      for (const filePath of config) {
        const currentPath = resolve(
          dirPath,
          await this.renderTemplateString(filePath, context)
        );

        const currentBaseDirPath = dirname(currentPath);
        if (!this.fileService.dirExistsSync(currentBaseDirPath)) {
          mkdirSync(currentBaseDirPath, { recursive: true });
        }

        await this.createFileFromTemplate(currentPath, namespace, context);
      }
      return;
    }

    for (const dir of Object.keys(config)) {
      const templateConfig = config[dir];
      const currentPath = resolve(
        dirPath,
        await this.renderTemplateString(dir, context)
      );

      if (typeof templateConfig === 'string') {
        const currentBaseDirPath = dirname(currentPath);
        if (!this.fileService.dirExistsSync(currentBaseDirPath)) {
          mkdirSync(currentBaseDirPath, { recursive: true });
        }

        await this.createFileFromTemplate(
          currentPath,
          join(namespace, templateConfig),
          context
        );
      } else {
        mkdirSync(currentPath, { recursive: true });
        await this.renderTemplateTree(
          currentPath,
          namespace,
          templateConfig,
          context
        );
      }
    }
  }

  async createFileFromTemplate(
    filePath: string,
    namespace: string,
    context: Object,
    encoding = 'utf8'
  ): Promise<void> {
    const parentDir = dirname(filePath);
    if (!this.fileService.dirExistsSync(parentDir)) {
      throw new Error(
        `Unable to create file "${filePath}", directory "${parentDir}" does not exist`
      );
    }

    const templateKey = extname(namespace)
      ? namespace
      : join(namespace, basename(filePath));
    const fileContent = await this.renderTemplateFile(templateKey, context);

    await this.fileFactory
      .fromString(fileContent, filePath, encoding)
      .saveFile();
  }

  async getTemplateFileContent(template: string): Promise<string> {
    const templatePath = join('./../templates', template + '.template');

    let templateContent: string;
    try {
      const importedContent = await import(templatePath);
      if ('string' === typeof importedContent) {
        templateContent = importedContent;
      } else if (
        'object' === typeof importedContent &&
        'string' === typeof importedContent.default
      ) {
        templateContent = importedContent.default;
      } else {
        throw new Error(
          `Unexpected content retrieved from importing template file "${templatePath}": ${typeof importedContent}`
        );
      }
    } catch (error) {
      throw new Error(
        `An error occurred while importing template file "${templatePath}"`
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

      const partialTemplateKey = `${
        template.split(sep)[0]
      }/partials/${partialName}`;
      const partialTmplateContent = await this.getTemplateFileContent(
        partialTemplateKey
      );

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
    compiledTemplate = compile(templateContent);

    this.compiledTemplates.set(templateKey, compiledTemplate);

    return compiledTemplate;
  }

  async renderTemplateString(
    template: string,
    context: Object
  ): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateString(
      template,
      template
    );
    return compiledTemplate(context);
  }

  async getCompiledTemplateFile(
    templateKey: string
  ): Promise<CompiledTemplate> {
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
      throw new Error(
        `An error occurred while compiling template "${templateKey}": ${error}`
      );
    }
  }

  async renderTemplateFile(
    templateKey: string,
    context: Object
  ): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateFile(templateKey);
    try {
      const content = compiledTemplate(context);
      return content;
    } catch (error) {
      throw new Error(
        `An error occurred while rendering template "${templateKey}": ${error}`
      );
    }
  }
}
