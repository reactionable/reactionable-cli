import { extname } from "node:path";
import { inject } from "inversify";

import { CliService } from "../CliService";
import { DirectoryService } from "./DirectoryService";
import { FileDiffService } from "./FileDiffService";
import { FileService } from "./FileService";
import { JsonFile } from "./JsonFile";
import { StdFile } from "./StdFile";
import { TomlFile } from "./TomlFile";
import { TypescriptFile } from "./TypescriptFile";

export enum FileContentType {
	mtime,
	content,
	lines,
}

export type CachedFileContent = {
	[FileContentType.mtime]: Date;
	[FileContentType.content]: string;
};

export class FileFactory {
	private cachedFileContents: Map<string, CachedFileContent> = new Map();

	constructor(
		@inject(DirectoryService)
		private readonly _directoryService: DirectoryService,
		@inject(FileService) private readonly _fileService: FileService,
		@inject(FileDiffService) private readonly _fileDiffService: FileDiffService,
		@inject(CliService) private readonly _cliService: CliService,
	) {}

	get directoryService(): DirectoryService {
		return this._directoryService;
	}

	get fileService(): FileService {
		return this._fileService;
	}

	get fileDiffService(): FileDiffService {
		return this._fileDiffService;
	}

	get cliService(): CliService {
		return this._cliService;
	}

	async fromFile<File extends StdFile = StdFile>(
		file: string,
		encoding: BufferEncoding = "utf8",
	): Promise<File> {
		const realpath = await this.fileService.getFileRealpath(file);
		const fileModificationDate =
			await this.fileService.getFileModificationDate(file);

		let content: string | undefined;
		const cachedContent = this.cachedFileContents.get(realpath);
		if (
			cachedContent &&
			cachedContent[FileContentType.mtime] >= fileModificationDate
		) {
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
			throw new Error(
				`An error occurred while parsing file "${file}": ${JSON.stringify(error)}`,
				{
					cause: error,
				},
			);
		}
	}

	fromString(
		content: string,
		file: string,
		encoding: BufferEncoding = "utf8",
	): StdFile | JsonFile | TomlFile | TypescriptFile {
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
