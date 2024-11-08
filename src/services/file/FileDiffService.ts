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

  async getFileContentDiff(
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

    const changes = diffLines(fileContent, newFileContent);

    // Retrieve previous changes
    const overwritedChanges = await this.getOverwritedFilesChanges(filepath);
    if (!overwritedChanges) {
      return changes;
    }

    // Check if changes occured on past overwrites
    const hasSomeNewChange = changes.some((change) => {
      for (const overwritedChange of overwritedChanges) {
        // TODO: compare changes
        const changeDiffs = overwritedChange !== change;
        if (changeDiffs) {
          return true;
        }
      }
      return false;
    });

    if (hasSomeNewChange) {
      return changes;
    }

    return [];
  }

  private async getOverwritedFilesChanges(filepath: string): Promise<Change[] | undefined> {
    const fileRealpath = await this.fileService.getFileRealpath(filepath);
    return FileDiffService.overwritedFilesChanges.get(fileRealpath);
  }

  async setOverwritedFilesChanges(filepath: string, diff: Change[]): Promise<void> {
    const fileRealpath = await this.fileService.getFileRealpath(filepath);
    FileDiffService.overwritedFilesChanges.set(fileRealpath, diff);
  }
}
