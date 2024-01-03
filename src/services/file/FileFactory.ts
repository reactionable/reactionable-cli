import { extname } from "path";

import { inject, injectable } from "inversify";

import { CliService } from "../CliService";
import { FileDiffService } from "./FileDiffService";
import { FileService } from "./FileService";
import { JsonFile } from "./JsonFile";
import { StdFile } from "./StdFile";
import { TomlFile } from "./TomlFile";
import { TypescriptFile } from "./TypescriptFile";
import { DirectoryService } from "./DirectoryService";

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
    @inject(DirectoryService) private readonly directoryService: DirectoryService,
    @inject(FileService) private readonly fileService: FileService,
    @inject(FileDiffService) private readonly fileDiffService: FileDiffService,
    @inject(CliService) private readonly cliService: CliService
  ) {}

  async fromFile<File extends StdFile = StdFile>(
    file: string,
    encoding: BufferEncoding = "utf8"
  ): Promise<File> {
    const realpath = await this.fileService.getFileRealpath(file);
    const fileModificationDate = await this.fileService.getFileModificationDate(file);

    let content: string | undefined = undefined;
    const cachedContent = this.cachedFileContents.get(realpath);
    if (cachedContent && cachedContent[FileContentType.mtime] >= fileModificationDate) {
      content = cachedContent[FileContentType.content];
    }

    if (!content) {
      content = await this.fileService.getFileContent(file, encoding);

      this.cachedFileContents.set(realpath, {
        [FileContentType.mtime]: fileModificationDate,
        [FileContentType.content]: content,
      });
    }

    try {
      return this.fromString(content, file, encoding) as File;
    } catch (error) {
      throw new Error(`An error occurred while parsing file "${file}": ${JSON.stringify(error)}`);
    }
  }

  fromString(content: string, file: string, encoding: BufferEncoding = "utf8"): StdFile {
    const args = [
      this.cliService,
      this.directoryService,
      this.fileService,
      this.fileDiffService,
      this,
      file,
      encoding,
      content,
    ] as ConstructorParameters<typeof StdFile>;

    switch (extname(file)) {
      case ".json":
        return new JsonFile(...args);
      case ".toml":
        return new TomlFile(...args);
      case ".tsx":
      case ".ts":
        return new TypescriptFile(...args);
      default:
        return new StdFile(...args);
    }
  }
}
