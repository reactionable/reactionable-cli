import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';

import { CliService } from '../CliService';
import { FileDiffService } from './FileDiffService';
import { FileFactory } from './FileFactory';
import { FileService } from './FileService';

export class StdFile {
  protected content = '';
  constructor(
    protected readonly cliService: CliService,
    protected readonly fileService: FileService,
    protected readonly fileDiffService: FileDiffService,
    protected readonly fileFactory: FileFactory,
    protected readonly file: string | null = null,
    protected readonly encoding: BufferEncoding = 'utf8',
    content = ''
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
    return content.replace(/(?:\r\n|\r|\n)/g, '\n');
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
        throw new Error('A file path is mandatory to save file');
      }
      file = this.file;
    }

    // Check if file directory exist
    if (!this.fileService.fileDirExistsSync(file)) {
      throw new Error(`Unable to create file "${file}, parent directory does not exist`);
    }

    const newFileContent = this.fixContentEOL(this.getContent()).trim();
    encoding = encoding === null ? this.encoding : encoding;

    if (this.fileService.fileExistsSync(file)) {
      const fileContent = readFileSync(file).toString(encoding);
      const diff = this.fileDiffService.getFileContentDiff(file, fileContent, newFileContent);

      if (diff.length) {
        const overwrite = await this.cliService.promptOverwriteFileDiff(file, diff);

        if (!overwrite) {
          // Do not update file, set real file content
          this.setContent(fileContent);
          return this;
        }
        this.fileDiffService.setOverwritedFilesChanges(file, diff);
      }
    }

    writeFileSync(file, newFileContent, encoding);
    return this;
  }
}
