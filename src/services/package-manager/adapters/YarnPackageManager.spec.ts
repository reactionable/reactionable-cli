// Mock child_process before any imports
import { jest } from "@jest/globals";
jest.mock("child_process");

import container from "../../../container";
import { mockYarnCmd, mockYarnWorkspacesInfoCmd, restoreMockCmd } from "../../../tests/mock-cmd";
import {
  mockDirPath,
  mockMonorepoPackageDirName,
  mockMonorepoPackageDirPath,
  mockPackageName,
  mockYarnDir,
  mockYarnMonorepoDir,
  restoreMockFs,
} from "../../../tests/mock-fs";
import { CliService } from "../../CliService";
import { FileFactory } from "../../file/FileFactory";
import { FileService } from "../../file/FileService";
import { YarnPackageManager } from "../adapters/YarnPackageManager";

describe("yarnPackageManager", () => {
  const cliService = container.get(CliService);
  const fileService = container.get(FileService);
  const fileFactory = container.get(FileFactory);

  let adapter: YarnPackageManager;

  beforeEach(() => {
    adapter = new YarnPackageManager(cliService, fileService, fileFactory, mockDirPath);
    mockYarnDir();
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  describe("getMonorepoRootPath", () => {
    it("should retrieve monorepo root path for given directory path", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toStrictEqual(mockDirPath);
    });

    it("should retrieve undefined if given directory path is not a monorepo", async () => {
      expect.hasAssertions();

      mockYarnCmd();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toBeUndefined();
    });
  });

  describe("isMonorepoPackage", () => {
    it("should retrieve true if given directory path is a monorepo package", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      adapter = new YarnPackageManager(
        cliService,
        fileService,
        fileFactory,
        mockMonorepoPackageDirPath
      );

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(true);
    });

    it("should retrieve false if given directory path is a monorepo root package", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });

    it("should retrieve false if given directory path is a not a monorepo", async () => {
      expect.hasAssertions();

      mockYarnCmd().mockError("Cannot find the root of your workspace");

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });
  });
});
