import { realpathSync, statSync } from 'fs';

import { Change, diffLines } from 'diff';
import { inject, injectable } from 'inversify';

import { CliService } from '../CliService';

@injectable()
export class FileDiffService {
  static overwritedFilesChanges: Map<string, Change[]> = new Map();

  constructor(@inject(CliService) private readonly cliService: CliService) {}

  getFileContentDiff(filepath: string, fileContent: string, newFileContent: string): Change[] {
    const stat = statSync(filepath);

    // If file has been created during current process, do not need to check for diffs
    const runStartDate = this.cliService.getRunStartDate();
    if (runStartDate && stat.birthtime >= runStartDate) {
      return [];
    }

    // If file contents  are strictly same, do not need to check for diffs
    if (fileContent === newFileContent) {
      return [];
    }

    const changes = diffLines(fileContent, newFileContent);

    // Retrieve previous changes
    const overwritedChanges = this.getOverwritedFilesChanges(filepath);
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

  getOverwritedFilesChanges(filepath: string): Change[] | undefined {
    return FileDiffService.overwritedFilesChanges.get(realpathSync(filepath));
  }

  setOverwritedFilesChanges(filepath: string, diff: Change[]): void {
    FileDiffService.overwritedFilesChanges.set(realpathSync(filepath), diff);
  }
}
