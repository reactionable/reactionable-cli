import { resolve } from 'path';
import { cwd } from 'process';

import container from '../../../container';
import { YarnPackageManager } from '../adapters/YarnPackageManager';
import { CliService } from '../../CliService';
import {
  mockYarnDir,
  mockDirPath,
  restoreMockFs,
  mockYarnMonorepoDir,
  mockMonorepoPackageDirPath,
  mockPackageName,
  mockMonorepoPackageDirName,
} from '../../../tests/mock-fs';
import {
  restoreMockCmd,
  mockYarnCmd,
  mockYarnBinCmd,
  mockYarnWorkspacesInfoCmd,
} from '../../../tests/mock-cmd';
import { FileFactory } from '../../file/FileFactory';

describe('YarnPackageManager', () => {
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
      mockYarnBinCmd(mockDirPath);

      const result = await adapter.getNodeModulesDirPath();

      expect(result).toEqual(resolve(cwd(), mockDirPath, 'node_modules'));
    });
  });

  describe('getMonorepoRootPath', () => {
    it('should retrieve monorepo root path for given directory path', async () => {
      mockYarnMonorepoDir();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toEqual(mockDirPath);
    });

    it('should retrieve undefined if given directory path is not a monorepo', async () => {
      mockYarnCmd();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toBeUndefined();
    });
  });

  describe('isMonorepoPackage', () => {
    it('should retrieve true if given directory path is a monorepo package', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      adapter = new YarnPackageManager(
        cliService,
        fileFactory,
        mockMonorepoPackageDirPath
      );

      const result = await adapter.isMonorepoPackage();

      expect(result).toEqual(true);
    });

    it('should retrieve false if given directory path is a monorepo root package', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await adapter.isMonorepoPackage();

      expect(result).toEqual(false);
    });

    it('should retrieve false if given directory path is a not a monorepo', async () => {
      mockYarnCmd().mockError('Cannot find the root of your workspace');

      const result = await adapter.isMonorepoPackage();

      expect(result).toEqual(false);
    });
  });
});
