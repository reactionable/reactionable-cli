import { resolve } from 'path';
import { cwd } from 'process';

import container from '../../../container';
import {
  mockYarnBinCmd,
  mockYarnCmd,
  mockYarnWorkspacesInfoCmd,
  restoreMockCmd,
} from '../../../tests/mock-cmd';
import {
  mockDirPath,
  mockMonorepoPackageDirName,
  mockMonorepoPackageDirPath,
  mockPackageName,
  mockYarnDir,
  mockYarnMonorepoDir,
  restoreMockFs,
} from '../../../tests/mock-fs';
import { CliService } from '../../CliService';
import { FileFactory } from '../../file/FileFactory';
import { YarnPackageManager } from '../adapters/YarnPackageManager';

describe('yarnPackageManager', () => {
  const cliService = container.get(CliService);
  const fileFactory = container.get(FileFactory);

  let adapter: YarnPackageManager;

  beforeEach(() => {
    adapter = new YarnPackageManager(cliService, fileFactory, mockDirPath);
    mockYarnDir();
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  describe('getNodeModulesDirPath', () => {
    it('should retrieve "node_modules" directory path', async () => {
      expect.hasAssertions();

      mockYarnBinCmd(mockDirPath);

      const result = await adapter.getNodeModulesDirPath();

      expect(result).toStrictEqual(resolve(cwd(), mockDirPath, 'node_modules'));
    });
  });

  describe('getMonorepoRootPath', () => {
    it('should retrieve monorepo root path for given directory path', async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toStrictEqual(mockDirPath);
    });

    it('should retrieve undefined if given directory path is not a monorepo', async () => {
      expect.hasAssertions();

      mockYarnCmd();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toBeUndefined();
    });
  });

  describe('isMonorepoPackage', () => {
    it('should retrieve true if given directory path is a monorepo package', async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      adapter = new YarnPackageManager(cliService, fileFactory, mockMonorepoPackageDirPath);

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(true);
    });

    it('should retrieve false if given directory path is a monorepo root package', async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });

    it('should retrieve false if given directory path is a not a monorepo', async () => {
      expect.hasAssertions();

      mockYarnCmd().mockError('Cannot find the root of your workspace');

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });
  });
});
