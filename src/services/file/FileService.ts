import { existsSync, lstatSync, realpathSync } from 'fs';
import { basename, dirname, extname, resolve } from 'path';

import { injectable } from 'inversify';
import { mv } from 'shelljs';

@injectable()
export class FileService {
  fileExistsSync(path: string): boolean {
    if (!existsSync(path)) {
      return false;
    }
    return lstatSync(path).isFile();
  }

  dirExistsSync(path: string): boolean {
    if (!existsSync(path)) {
      return false;
    }
    return lstatSync(path).isDirectory();
  }

  assertDirExists(path: string): string {
    if (!this.dirExistsSync(path)) {
      throw new Error(`Directory "${path}" does not exist`);
    }
    return realpathSync(path);
  }

  assertFileExists(path: string): string {
    if (!this.fileExistsSync(path)) {
      throw new Error(`File "${path}" does not exist`);
    }
    return realpathSync(path);
  }

  replaceFileExtension(filePath: string, newExtension: string, mustExist = false) {
    if (!this.fileExistsSync(filePath)) {
      if (mustExist) {
        throw new Error(`File "${filePath}" does not exist`);
      }
      return;
    }

    const newFilePath = resolve(
      dirname(filePath),
      `${basename(filePath, extname(filePath))}.${newExtension.replace(/^[\s\.]+/, '')}`
    );
    mv(filePath, newFilePath);
  }
}
