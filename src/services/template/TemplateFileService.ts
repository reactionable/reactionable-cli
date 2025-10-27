import { extname, join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { inject } from "inversify";

import { FileService } from "../file/FileService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class TemplateFileService {
  constructor(@inject(FileService) private readonly fileService: FileService) {}

  getTemplateDirectory(): string {
    return join(__dirname, "./../../templates");
  }

  async getTemplateFileContent(template: string): Promise<string> {
    const fileExt = extname(__filename);
    const templatePath = join(this.getTemplateDirectory(), template + ".template" + fileExt);
    const templateExists = await this.fileService.fileExists(templatePath);
    if (!templateExists) {
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

    return templateContent;
  }
}
