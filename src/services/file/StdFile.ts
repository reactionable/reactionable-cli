import { dirname } from "path";
import { EOL } from "os";

import { CliService } from "../CliService";
import { FileDiffService } from "./FileDiffService";
import { FileFactory } from "./FileFactory";
import { DirectoryService } from "./DirectoryService";
import { FileService } from "./FileService";

export class StdFile {
  protected content = "";

  constructor(
    protected readonly cliService: CliService,
    protected readonly directoryService: DirectoryService,
    protected readonly fileService: FileService,
    protected readonly fileDiffService: FileDiffService,
    protected readonly fileFactory: FileFactory,
    protected readonly file: string | null = null,
    protected readonly encoding: BufferEncoding = "utf8",
    content = ""
  ) {
    this.setContent(content);
  }

  protected setContent(content: string): this {
    this.content = this.parseContent(content);
    return this;
  }

  protected parseContent(content: string): string {
    return this.fixContentEOL(content);
  }

  protected fixContentEOL(content: string): string {
    return content.replace(/(?:\r\n|\r|\n)/g, "\n");
  }

  getContent(): string {
    return this.content;
  }

  replaceContent(search: RegExp, replacement: string): this {
    const newContent = this.getContent().replace(search, replacement);
    this.setContent(newContent);
    return this;
  }

  appendContent(content: string, after?: string, onlyIfNotExists = true): this {
    content = this.fixContentEOL(content);
    const fileContent = this.getContent();

    if (onlyIfNotExists) {
      if (fileContent.indexOf(content) !== -1) {
        return this;
      }
    }

    if (!after) {
      this.setContent(fileContent + EOL + content);
      return this;
    }

    const contentLines = content.split(EOL);
    const lines = fileContent.split(EOL);

    let lineNumber = 0;
    for (const line of lines) {
      // Write content after found line
      if (line === after) {
        lines.splice(lineNumber + 1, 0, ...contentLines);
        this.setContent(lines.join(EOL));
        return this;
      }
      lineNumber++;
    }
    return this;
  }

  async saveFile(file: string | null = null, encoding?: BufferEncoding): Promise<this> {
    if (file === null) {
      if (this.file === null) {
        throw new Error("A file path is mandatory to save file");
      }
      file = this.file;
    }

    // Check if file directory exist
    const parentDirPath = dirname(file);
    const parentDirExists = await this.directoryService.dirExists(parentDirPath);
    if (!parentDirExists) {
      throw new Error(
        `Unable to create file "${file}, parent directory ${parentDirPath} does not exist`
      );
    }

    const newFileContent = this.fixContentEOL(this.getContent()).trim();
    encoding = encoding ?? this.encoding;

    const fileExists = await this.fileService.fileExists(file);
    if (fileExists) {
      const fileContent = await this.fileService.getFileContent(file, encoding);
      const diff = await this.fileDiffService.getFileContentDiff(file, fileContent, newFileContent);

      if (diff.length) {
        const overwrite = await this.cliService.promptOverwriteFileDiff(file, diff);

        if (!overwrite) {
          // Do not update file, set real file content
          this.setContent(fileContent);
          return this;
        }
        await this.fileDiffService.setOverwritedFilesChanges(file, diff);
      }
    }

    await this.fileService.writeFileContent(file, newFileContent, encoding);
    return this;
  }
}
