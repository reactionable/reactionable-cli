import { resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { DirectoryService } from "./DirectoryService";

const testDirPath = "__tests__/test-react-project";

describe("DirectoryService", () => {
  let testDir: DirResult;
  let service: DirectoryService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(DirectoryService);
  });

  afterEach(() => {
    container.restore();
    testDir && testDir.removeCallback();
  });

  describe("dirExists", () => {
    it("should return true when the given path is an existing directory", async () => {
      const dirExists = await service.dirExists(testDirPath);
      expect(dirExists).toBe(true);
    });

    it("should return false when the given path is not an existing directory", async () => {
      const dirExists = await service.dirExists("/unexisting-directory");
      expect(dirExists).toBe(false);
    });
  });

  describe("getDirRealpath", () => {
    it("should return the directory realpath when the given path is an existing directory", async () => {
      const dirRealpath = await service.getDirRealpath(testDirPath);
      expect(dirRealpath).toEqual(resolve(testDirPath));
    });

    it("should throw an error when the given path is not an existing directory", async () => {
      const getDirRealpathOperation = service.getDirRealpath("/unexisting-directory");

      await expect(getDirRealpathOperation).rejects.toThrow(
        'Directory "/unexisting-directory" does not exist'
      );
    });
  });

  describe("createDir", () => {
    it("should create a directory for the given path", async () => {
      testDir = await createTmpDir();

      const dirpath = resolve(testDir.name, "test");
      await service.createDir(dirpath, false);

      const dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(true);
    });

    it("should create a directory recursively for the given path", async () => {
      testDir = await createTmpDir();

      const dirpath = resolve(testDir.name, "test1/test2/test3");
      await service.createDir(dirpath, true);

      const dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(true);
    });

    it("should create a directory for an existing path", async () => {
      testDir = await createTmpDir();

      const dirpath = resolve(testDir.name, "test1");
      await service.createDir(dirpath, true);

      let dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(true);

      await service.createDir(dirpath, true);
      dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(true);
    });
  });

  describe("removeDir", () => {
    it("should remove a directory for the given path", async () => {
      testDir = await createTmpDir();

      const dirpath = resolve(testDir.name, "test");
      await service.createDir(dirpath, false);

      let dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(true);

      await service.removeDir(dirpath);

      dirExists = await service.dirExists(dirpath);
      expect(dirExists).toBe(false);
    });
  });
});
