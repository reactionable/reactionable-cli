import { join, resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { FileService } from "./FileService";

const testDirPath = "__tests__/test-react-project";

describe("FileService", () => {
  let testDir: DirResult;
  let service: FileService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(FileService);
  });

  afterEach(() => {
    container.restore();
    testDir?.removeCallback();
  });

  describe("touchFile", () => {
    it("should touch a file for the given path", async () => {
      testDir = await createTmpDir();

      const filepath = resolve(testDir.name, "test.json");

      await service.touchFile(filepath);

      const fileExists = await service.fileExists(filepath);
      expect(fileExists).toBe(true);
    });

    it("should touch an existing file for the given path", async () => {
      testDir = await createTmpDir();

      const filepath = resolve(testDir.name, "test.json");
      await service.writeFileContent(filepath, "test", "utf8");
      const fileExists = await service.fileExists(filepath);
      expect(fileExists).toBe(true);

      const modificationDate = await service.getFileModificationDate(filepath);

      await new Promise((resolve) => setTimeout(resolve, 500));
      await service.touchFile(filepath);

      const modificationDateAfterTouch = await service.getFileModificationDate(filepath);

      expect(modificationDateAfterTouch.getTime()).toBeGreaterThan(modificationDate.getTime());
    });
  });

  describe("fileExists", () => {
    it("should return true when the given path is an existing file", async () => {
      const fileExists = await service.fileExists(join(testDirPath, "package.json"));
      expect(fileExists).toBe(true);
    });

    it("should return false when the given path is not an existing file", async () => {
      const fileExists = await service.fileExists(join(testDirPath, "unexisting-file.test"));
      expect(fileExists).toBe(false);
    });
  });

  describe("replaceFileExtension", () => {
    it("should not throw an error when the given path is not an existing file", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");
      const result = await service.replaceFileExtension(testFilePath, "ts");
      expect(result).toBeUndefined();
    });

    it("should throw an error when the given path is not an existing file but must exist", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");

      const replaceFileExtensionOperation = service.replaceFileExtension(testFilePath, "ts", true);

      await expect(replaceFileExtensionOperation).rejects.toThrow(
        `File "${testFilePath}" does not exist`
      );
    });
  });

  describe("getFileRealpath", () => {
    it("should return the file realpath when the given path is an existing file", async () => {
      const testFilePath = join(testDirPath, "package.json");

      const fileRealpath = await service.getFileRealpath(testFilePath);

      expect(fileRealpath).toEqual(resolve(testFilePath));
    });

    it("should throw an error when the given path is not an existing file", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");

      const assertFileExistsOperation = service.getFileRealpath(testFilePath);

      await expect(assertFileExistsOperation).rejects.toThrow(
        `File "${testFilePath}" does not exist`
      );
    });
  });

  describe("getFileCreationDate", () => {
    it("should return the file creation date when the given path is an existing file", async () => {
      const testFilePath = join(testDirPath, "package.json");

      const fileCreationDate = await service.getFileCreationDate(testFilePath);
      expect(fileCreationDate).toBeInstanceOf(Date);
    });
  });

  describe("getFileModificationDate", () => {
    it("should return the file modication date when the given path is an existing file", async () => {
      const testFilePath = join(testDirPath, "package.json");

      const fileCreationDate = await service.getFileModificationDate(testFilePath);
      expect(fileCreationDate).toBeInstanceOf(Date);
    });
  });

  describe("getFileContent", () => {
    it("should return the file content when the given path is an existing file", async () => {
      const testFilePath = join(testDirPath, "package.json");

      const fileContent = await service.getFileContent(testFilePath, "utf8");
      expect(fileContent).toContain('"name": "tests"');
    });
  });

  describe("writeFileContent", () => {
    it("should write the file content when the given path is an existing file", async () => {
      testDir = await createTmpDir();

      const filepath = resolve(testDir.name, "test.json");

      await service.writeFileContent(filepath, "test", "utf8");

      const fileContent = await service.getFileContent(filepath, "utf8");
      expect(fileContent).toBe("test");
    });
  });
});
