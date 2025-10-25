import { sep } from "path";

import { Eta } from "eta";
import { inject } from "inversify";

import { TemplateContext } from "../TemplateContext";
import { TemplateFileService } from "../TemplateFileService";
import { TemplateAdapter } from "./TemplateAdapter";
import { TemplateAdapterHelper } from "./TemplateAdapterHelper";

// TemplateFunction type is not exported in eta v4, so we get it from the compile method return type
type TemplateFunction = ReturnType<Eta["compile"]>;

export class EtaAdapter implements TemplateAdapter {
  private readonly eta: Eta;

  private readonly compiledTemplates: Map<string, TemplateFunction> = new Map();

  constructor(
    @inject(TemplateFileService) private readonly templateFileService: TemplateFileService,
    @inject(TemplateAdapterHelper) private readonly templateAdapterHelper: TemplateAdapterHelper
  ) {
    this.eta = new Eta({
      views: this.templateFileService.getTemplateDirectory(),
      debug: true,
      cache: true, // Make Eta cache templates
      autoEscape: false, // Not automatically XML-escape interpolations
      autoTrim: false, // automatic whitespace trimming,
    });
  }

  async renderTemplateString(template: string, context: TemplateContext): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateString(template, template);
    try {
      return this.renderCompiledTemplate(compiledTemplate, context);
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

  async renderTemplateFile(templateKey: string, context: TemplateContext): Promise<string> {
    const compiledTemplate = await this.getCompiledTemplateFile(templateKey);
    try {
      return await this.renderCompiledTemplate(compiledTemplate, context);
    } catch (error) {
      throw new Error(`An error occurred while rendering template "${templateKey}": ${error}`);
    }
  }

  private async renderCompiledTemplate(
    compiledTemplate: TemplateFunction,
    context: TemplateContext
  ) {
    const data = {
      ...context,
      ...this.templateAdapterHelper.getHelpers(),
      render: this.eta.renderString.bind(this.eta),
    };

    const content = compiledTemplate.apply(this.eta, [data, { async: true }]);

    return content;
  }

  private async getCompiledTemplateString(
    templateKey: string,
    templateContent: string
  ): Promise<TemplateFunction> {
    const compiledTemplate = this.compiledTemplates.get(templateKey);

    if (compiledTemplate) {
      return compiledTemplate;
    }

    return this.compileTemplate(templateContent, templateKey);
  }

  private async getCompiledTemplateFile(templateKey: string): Promise<TemplateFunction> {
    const compiledTemplate = this.compiledTemplates.get(templateKey);
    if (compiledTemplate) {
      return compiledTemplate;
    }

    const templateFileContent = await this.templateFileService.getTemplateFileContent(templateKey);
    return this.compileTemplate(templateFileContent, templateKey);
  }

  private async compileTemplate(
    templateContent: string,
    templateKey: string
  ): Promise<TemplateFunction> {
    await this.registerPartials(templateKey, templateContent);
    try {
      const compiledTemplate = this.eta.compile(templateContent);

      if (templateKey) {
        this.compiledTemplates.set(templateKey, compiledTemplate);
      }

      return compiledTemplate;
    } catch (error) {
      throw new Error(`An error occurred while compiling template "${templateKey}": ${error}`);
    }
  }

  private async registerPartials(templateKey: string, templateContent: string) {
    // Register partials if any
    const regex = /<%= include\("(@[a-zA-Z]+)"/gim;
    let matches;
    while ((matches = regex.exec(templateContent)) !== null) {
      if (matches.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      const partialName: string = matches[1];

      if (await this.eta.templatesAsync.get(partialName)) {
        continue;
      }

      const partialTemplateKey = `${templateKey.split(sep)[0]}/partials/${partialName.replace(
        "@",
        ""
      )}`;

      const partialTemplateContent =
        await this.templateFileService.getTemplateFileContent(partialTemplateKey);

      const compiledTemplate = await this.compileTemplate(
        partialTemplateContent,
        partialTemplateKey
      );

      this.eta.loadTemplate(partialName, compiledTemplate);
    }
  }
}
