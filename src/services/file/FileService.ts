import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  realpathSync,
  rmdirSync,
  statSync,
  unlinkSync,
  utimesSync,
} from "fs";
import { basename, dirname, extname, resolve } from "path";

import { injectable } from "inversify";
import { mv } from "shelljs";

@injectable()
export class FileService {
  touchFileSync(path: string): void {
    const time = new Date();
    try {
      utimesSync(path, time, time);
    } catch (err) {
      closeSync(openSync(path, "w"));
    }
  }

  fileExistsSync(path: string): boolean {
    if (!existsSync(path)) {
      return false;
    }
    return statSync(path).isFile();
  }

  dirExistsSync(path: string): boolean {
    if (!existsSync(path)) {
      return false;
    }
    return statSync(path).isDirectory();
  }

  fileDirExistsSync(path: string): boolean {
    return this.dirExistsSync(dirname(path));
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

  replaceFileExtension(filePath: string, newExtension: string, mustExist = false): void {
    if (!this.fileExistsSync(filePath)) {
      if (mustExist) {
        throw new Error(`File "${filePath}" does not exist`);
      }
      return;
    }

    const newFilePath = resolve(
      dirname(filePath),
      `${basename(filePath, extname(filePath))}.${newExtension.replace(/^[\s.]+/, "")}`
    );
    mv(filePath, newFilePath);
  }

  mkdirSync(dirpath: string, recursive: boolean): void {
    if (this.dirExistsSync(dirpath)) {
      return;
    }

    if (!this.fileDirExistsSync(dirpath)) {
      const parentDirectory = dirname(dirpath);
      if (!recursive) {
        throw new Error(
          `Unable to create directory "${dirpath}" in unexisting directory "${parentDirectory}"`
        );
      }
    }

    mkdirSync(dirpath, { recursive });
  }

  rmdirSync(dirpath: string): void {
    if (!this.dirExistsSync(dirpath)) {
      return;
    }
    const list = readdirSync(dirpath);
    for (const filepath of list) {
      const filename = resolve(dirpath, filepath);
      const stat = statSync(filename);

      if (filename == "." || filename == "..") {
        // pass these files
      } else if (stat.isDirectory()) {
        // rmdir recursively
        this.rmdirSync(filename);
      } else {
        // rm filename
        unlinkSync(filename);
      }
    }
    rmdirSync(dirpath);
  }
}
