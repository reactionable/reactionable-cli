import { mkdir, readdir, realpath, rmdir, stat, unlink } from "fs/promises";
import { dirname, resolve } from "path";

export class DirectoryService {
  async dirExists(path: string): Promise<boolean> {
    try {
      const stats = await stat(path);
      return stats.isDirectory();
    } catch (error) {
      const message = (error as NodeJS.ErrnoException)?.message;
      if (!message) {
        throw error;
      }

      const directoryNotFoundExceptions = [
        "ENOENT: no such file or directory, stat",
        "ENOENT, no such file or directory",
      ];
      if (directoryNotFoundExceptions.some((exception) => message.startsWith(exception))) {
        return false;
      }

      throw error;
    }
  }

  async getDirRealpath(path: string): Promise<string> {
    const dirExists = await this.dirExists(path);
    if (!dirExists) {
      throw new Error(`Directory "${path}" does not exist`);
    }
    return realpath(path);
  }

  async createDir(dirpath: string, recursive: boolean): Promise<void> {
    const dirExists = await this.dirExists(dirpath);
    if (dirExists) {
      return;
    }

    const parentDirectoryPath = dirname(dirpath);
    const parentDirectoryExists = await this.dirExists(parentDirectoryPath);
    if (!parentDirectoryExists) {
      if (!recursive) {
        throw new Error(
          `Unable to create directory "${dirpath}" in unexisting directory "${parentDirectoryPath}"`
        );
      }
    }

    await mkdir(dirpath, { recursive });
  }

  async removeDir(dirpath: string): Promise<void> {
    const dirExists = await this.dirExists(dirpath);
    if (!dirExists) {
      return;
    }

    const list = await readdir(dirpath);
    for (const filepath of list) {
      const filename = await resolve(dirpath, filepath);
      const stats = await stat(filename);

      if (filename == "." || filename == "..") {
        // pass these files
      } else if (stats.isDirectory()) {
        // rmdir recursively
        await this.removeDir(filename);
      } else {
        // rm filename
        await unlink(filename);
      }
    }
    await rmdir(dirpath);
  }
}
