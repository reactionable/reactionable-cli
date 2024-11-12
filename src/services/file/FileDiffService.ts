import { Change, diffLines } from "diff";
import { inject } from "inversify";

import { CliService } from "../CliService";
import { FileService } from "./FileService";

export class FileDiffService {
  static overwritedFilesChanges: Map<string, Change[]> = new Map();

  constructor(
    @inject(CliService) private readonly cliService: CliService,
    @inject(FileService) private readonly fileService: FileService
  ) {}

  async getFileContentChanges(
    filepath: string,
    fileContent: string,
    newFileContent: string
  ): Promise<Change[]> {
    // If file has been created during current process, do not need to check for diffs
    const runStartDate = this.cliService.getRunStartDate();
    const fileCreationDate = await this.fileService.getFileCreationDate(filepath);
    if (runStartDate && fileCreationDate >= runStartDate) {
      return [];
    }

    // If file contents  are strictly same, do not need to check for diffs
    if (fileContent === newFileContent) {
      return [];
    }

    return diffLines(fileContent, newFileContent, { oneChangePerToken: true });
  }

  async fileNeedsOverwrite(filePath: string, changes: Change[]): Promise<boolean> {
    if (!changes.length) {
      return false;
    }

    const overwritedChanges = await this.getOverwritedFileChanges(filePath);
    if (!overwritedChanges) {
      return true;
    }

    const nonOverwritedChanges: Change[] = [];

    let currentLine = -1;
    for (const change of changes) {
      if (change.count === undefined) {
        nonOverwritedChanges.push(change);
        continue;
      }
      currentLine += change.count;

      const overwritedChange = this.getOverwritedLineChange(currentLine, overwritedChanges);
      if (!overwritedChange) {
        nonOverwritedChanges.push(change);
      }
    }

    return nonOverwritedChanges.length > 0;
  }

  private async getOverwritedFileChanges(filepath: string): Promise<Change[] | undefined> {
    const fileRealpath = await this.fileService.getFileRealpath(filepath);
    return FileDiffService.overwritedFilesChanges.get(fileRealpath);
  }

  private getOverwritedLineChange(line: number, changes: Change[]): Change | undefined {
    let currentLine = -1;
    for (const change of changes) {
      if (change.count === undefined) {
        continue;
      }

      currentLine += change.count;
      if (currentLine === line) {
        return change;
      }
    }
  }

  async setOverwritedFileChanges(filepath: string, diff: Change[]): Promise<void> {
    const fileRealpath = await this.fileService.getFileRealpath(filepath);
    FileDiffService.overwritedFilesChanges.set(fileRealpath, diff);
  }
}
