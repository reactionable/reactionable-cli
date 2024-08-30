import { open, realpath, stat, utimes, rename, readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, resolve } from "path";
import { injectable } from "inversify";

@injectable()
export class FileService {
  async touchFile(path: string): Promise<void> {
    const time = new Date();
    try {
      await utimes(path, time, time);
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const fileHandle = await open(path, "w");
        await fileHandle.close();
      }
    }
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      const stats = await stat(path);
      return stats.isFile();
    } catch (error) {
      const message = (error as NodeJS.ErrnoException)?.message;
      if (!message) {
        throw error;
      }

      const fileNotFoundExceptions = [
        "ENOENT: no such file or directory, stat",
        "ENOENT, no such file or directory",
      ];
      if (fileNotFoundExceptions.some((exception) => message.startsWith(exception))) {
        return false;
      }

      throw error;
    }
  }

  async replaceFileExtension(
    filePath: string,
    newExtension: string,
    mustExist = false
  ): Promise<void> {
    const fileExists = await this.fileExists(filePath);
    if (!fileExists) {
      if (mustExist) {
        throw new Error(`File "${filePath}" does not exist`);
      }
      return;
    }

    const newFilePath = resolve(
      dirname(filePath),
      `${basename(filePath, extname(filePath))}.${newExtension.replace(/^[\s.]+/, "")}`
    );

    await rename(filePath, newFilePath);
  }

  async getFileRealpath(path: string): Promise<string> {
    const fileExists = await this.fileExists(path);
    if (!fileExists) {
      throw new Error(`File "${path}" does not exist`);
    }
    return realpath(path);
  }

  async getFileCreationDate(path: string): Promise<Date> {
    return new Date((await stat(path)).birthtime);
  }

  async getFileModificationDate(path: string): Promise<Date> {
    const stats = await stat(path);
    return new Date(Math.max.apply(null, [stats.birthtime.getTime(), stats.mtime.getTime()]));
  }

  async getFileContent(path: string, encoding: BufferEncoding): Promise<string> {
    const content = (await readFile(path, { encoding })).toString();
    return content;
  }

  async writeFileContent(path: string, content: string, encoding: BufferEncoding): Promise<void> {
    await writeFile(path, content, encoding);
  }
}
