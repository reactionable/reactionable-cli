import { writeFileSync, statSync, realpathSync } from 'fs';
import { diffLines, Change } from 'diff';
import { EOL } from 'os';
import { FileFactory } from './FileFactory';
import { FileService } from './FileService';
import { CliService } from '../CliService';

const overwritedFilesChanges: {
  [key: string]: Change[];
} = {};

export class StdFile {
  protected content: string = '';
  constructor(
    protected readonly cliService: CliService,
    protected readonly fileService: FileService,
    protected readonly fileFactory: FileFactory,
    protected readonly file: string | null = null,
    protected readonly encoding: string = 'utf8',
    content: string = ''
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

  protected getContentDiff(content): Change[] {
    return diffLines(content, this.getContent());
  }

  protected checkSafeOverwriteChanges(
    file: string,
    encoding: string
  ): Change[] {
    if (!this.fileService.fileExistsSync(file)) {
      return [];
    }
    const stat = statSync(file);

    // If file has been created during current process
    const runStartDate = this.cliService.getRunStartDate();
    if (runStartDate && stat.birthtime >= runStartDate) {
      return [];
    }

    const fileContent = this.fileFactory.fromFile(file, encoding).getContent();
    const changes = this.getContentDiff(fileContent);

    const overwritedChanges = overwritedFilesChanges[realpathSync(file)];
    if (!overwritedChanges) {
      return changes;
    }

    // Check if changes occured on past overwrites
    const hasSomeNewChange = changes.some((change) => {
      for (const overwritedChange of overwritedChanges) {
        // TODO: compare changes
      }
      return true;
    });

    if (hasSomeNewChange) {
      return changes;
    }

    return [];
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

  async saveFile(
    file: string | null = null,
    encoding: string | null = null
  ): Promise<this> {
    if (file === null) {
      if (this.file === null) {
        throw new Error('A file path is mandatory to save file');
      }
      file = this.file;
    }

    const content = this.fixContentEOL(this.getContent());
    encoding = encoding === null ? this.encoding : encoding;

    const diff = this.checkSafeOverwriteChanges(file, encoding);
    if (!diff.length) {
      writeFileSync(file, content, encoding);
      return this;
    }

    const overwrite = await this.cliService.promptOverwriteFileDiff(file, diff);

    if (overwrite) {
      overwritedFilesChanges[realpathSync(file)] = diff;
      writeFileSync(file, content, encoding);
    } else {
      this.setContent(this.fileFactory.fromFile(file, encoding).getContent());
    }
    return this;
  }
}