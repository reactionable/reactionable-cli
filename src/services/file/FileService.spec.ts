import { join, resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { FileService } from "./FileService";

const testDirPath = "__tests__/test-react-project";

describe("fileService", () => {
  let testDir: DirResult;
  let service: FileService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(FileService);
  });

  afterEach(() => {
    container.restore();
    testDir && testDir.removeCallback();
  });

  describe("touchFile", () => {
    it("should touch a file for the given path", async () => {
      testDir = createTmpDir(false);

      const filepath = resolve(testDir.name, "test.json");

      service.touchFileSync(filepath);

      const dirExists = service.fileExistsSync(filepath);
      expect(dirExists).toBe(true);
    });

    it("should touch an existing file for the given path", async () => {
      testDir = createTmpDir(false);

      const filepath = resolve(testDir.name, "test.json");

      service.touchFileSync(filepath);
      service.touchFileSync(filepath);

      const dirExists = service.fileExistsSync(filepath);
      expect(dirExists).toBe(true);
    });
  });

  describe("fileExistsSync", () => {
    it("should return true when the given path is an existing file", async () => {
      const fileExists = service.fileExistsSync(join(testDirPath, "package.json"));
      expect(fileExists).toBe(true);
    });
    it("should return false when the given path is not an existing file", async () => {
      const fileExists = service.fileExistsSync(join(testDirPath, "unexisting-file.test"));
      expect(fileExists).toBe(false);
    });
  });

  describe("dirExistsSync", () => {
    it("should return true when the given path is an existing directory", async () => {
      const dirExists = service.dirExistsSync(testDirPath);
      expect(dirExists).toBe(true);
    });
    it("should return false when the given path is not an existing directory", async () => {
      const dirExists = service.dirExistsSync("/unexisting-directory");
      expect(dirExists).toBe(false);
    });
  });

  describe("fileDirExistsSync", () => {
    it("should return true when the given path directory exists", async () => {
      const dirExists = service.fileDirExistsSync(join(testDirPath, "package.json"));
      expect(dirExists).toBe(true);
    });
    it("should return false when the given path directory does not exist", async () => {
      const dirExists = service.fileDirExistsSync(join("/unexisting-directory", "package.json"));
      expect(dirExists).toBe(false);
    });
  });

  describe("assertDirExists", () => {
    it("should return the directory realpath when the given path is an existing directory", async () => {
      const dirRealpath = service.assertDirExists(testDirPath);
      expect(dirRealpath).toEqual(resolve(testDirPath));
    });
    it("should throw an error when the given path is not an existing directory", async () => {
      const assertDirExistsOperation = () => {
        service.assertDirExists("/unexisting-directory");
      };
      expect(assertDirExistsOperation).toThrow('Directory "/unexisting-directory" does not exist');
    });
  });

  describe("assertFileExists", () => {
    it("should return the fileectory realpath when the given path is an existing file", async () => {
      const testFilePath = join(testDirPath, "package.json");
      const fileRealpath = service.assertFileExists(testFilePath);
      expect(fileRealpath).toEqual(resolve(testFilePath));
    });
    it("should throw an error when the given path is not an existing file", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");
      const assertFileExistsOperation = () => {
        service.assertFileExists(testFilePath);
      };
      expect(assertFileExistsOperation).toThrow(`File "${testFilePath}" does not exist`);
    });
  });

  describe("replaceFileExtension", () => {
    it("should not throw an error when the given path is not an existing file", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");
      const result = service.replaceFileExtension(testFilePath, "ts");
      expect(result).toBeUndefined();
    });

    it("should throw an error when the given path is not an existing file but must exist", async () => {
      const testFilePath = join("/unexisting-fileectory", "package.json");
      const replaceFileExtensionOperation = () => {
        service.replaceFileExtension(testFilePath, "ts", true);
      };
      expect(replaceFileExtensionOperation).toThrow(`File "${testFilePath}" does not exist`);
    });
  });

  describe("mkdirSync", () => {
    it("should create a directory for the given path", async () => {
      testDir = createTmpDir(false);

      const dirpath = resolve(testDir.name, "test");
      service.mkdirSync(dirpath, false);

      const dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(true);
    });

    it("should create a directory recursively for the given path", async () => {
      testDir = createTmpDir(false);

      const dirpath = resolve(testDir.name, "test1/test2/test3");
      service.mkdirSync(dirpath, true);

      const dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(true);
    });

    it("should create a directory for an existing path", async () => {
      testDir = createTmpDir(false);

      const dirpath = resolve(testDir.name, "test1");
      service.mkdirSync(dirpath, true);

      let dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(true);

      service.mkdirSync(dirpath, true);
      dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(true);
    });
  });

  describe("rmdirSync", () => {
    it("should remove a directory for the given path", async () => {
      testDir = createTmpDir(false);

      const dirpath = resolve(testDir.name, "test");
      service.mkdirSync(dirpath, false);

      let dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(true);

      service.rmdirSync(dirpath);

      dirExists = service.dirExistsSync(dirpath);
      expect(dirExists).toBe(false);
    });
  });
});
