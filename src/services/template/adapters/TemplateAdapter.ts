import { TemplateContext } from "../TemplateContext";

export interface TemplateAdapter {
  renderTemplateString(template: string, context: TemplateContext): Promise<string>;

  renderTemplateFile(templateKey: string, context: TemplateContext): Promise<string>;
}
