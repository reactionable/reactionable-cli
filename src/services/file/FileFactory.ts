import { readFileSync, statSync } from 'fs';
import { extname } from 'path';

import { inject, injectable } from 'inversify';

import { CliService } from '../CliService';
import { FileService } from './FileService';
import { JsonFile } from './JsonFile';
import { StdFile } from './StdFile';
import { TomlFile } from './TomlFile';
import { TypescriptFile } from './TypescriptFile';

export enum FileContentType {
  mtime,
  content,
  lines,
}

export type CachedFileContent = {
  [FileContentType.mtime]: Date;
  [FileContentType.content]: string;
};

@injectable()
export class FileFactory {
  private cachedFileContents: Map<string, CachedFileContent> = new Map();

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(CliService) private readonly cliService: CliService
  ) {}

  fromFile<File extends StdFile = StdFile>(file: string, encoding: BufferEncoding = 'utf8'): File {
    const realpath = this.fileService.assertFileExists(file);

    const stat = statSync(file);
    const realMtime = new Date(
      Math.max.apply(null, [stat.birthtime.getTime(), stat.mtime.getTime()])
    );

    let content: string | undefined = undefined;
    if (realMtime) {
      const cachedContent = this.cachedFileContents.get(realpath);
      if (cachedContent && cachedContent[FileContentType.mtime] >= realMtime) {
        content = cachedContent[FileContentType.content];
      }
    }

    if (!content) {
      content = readFileSync(file, { encoding }).toString();

      this.cachedFileContents.set(realpath, {
        [FileContentType.mtime]: realMtime,
        [FileContentType.content]: content,
      });
    }

    try {
      return this.fromString(content, file, encoding) as File;
    } catch (error) {
      throw new Error(`An error occurred while parsing file "${file}": ${JSON.stringify(error)}`);
    }
  }

  fromString(content: string, file: string, encoding: BufferEncoding = 'utf8'): StdFile {
    const args = [
      this.cliService,
      this.fileService,
      this,
      file,
      encoding,
      content,
    ] as ConstructorParameters<typeof StdFile>;

    switch (extname(file)) {
      case '.json':
        return new JsonFile(...args);
      case '.toml':
        return new TomlFile(...args);
      case '.tsx':
      case '.ts':
        return new TypescriptFile(...args);
      default:
        return new StdFile(...args);
    }
  }
}
