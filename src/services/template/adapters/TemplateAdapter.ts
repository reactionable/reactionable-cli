import type { TemplateContext } from "../TemplateContext.js";

export interface TemplateAdapter {
	renderTemplateString(
		template: string,
		context: TemplateContext,
	): Promise<string>;

	renderTemplateFile(
		templateKey: string,
		context: TemplateContext,
	): Promise<string>;
}
