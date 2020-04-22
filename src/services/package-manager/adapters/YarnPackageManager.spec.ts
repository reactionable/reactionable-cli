import { resolve } from 'path';
import { cwd } from 'process';

import container from '../../../container';
import { YarnPackageManager } from '../adapters/YarnPackageManager';
import { CliService } from '../../CliService';
import {
  mockYarnDir,
  mockDirPath,
  restoreMockFs,
} from '../../../tests/mock-fs';
import {
  restoreMockCmd,
  mockYarnCmd,
  MockedCmd,
} from '../../../tests/mock-cmd';

describe('YarnPackageManager', () => {
  let cliService: CliService;
  let yarnCmdMock: MockedCmd;

  let adapter: YarnPackageManager;

  beforeAll(() => {
    cliService = container.get(CliService);
  });

  beforeEach(() => {
    adapter = new YarnPackageManager(cliService, mockDirPath);
    mockYarnDir();
    yarnCmdMock = mockYarnCmd();
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  describe('getNodeModulesDirPath', () => {
    it('should retrieve "node_modules" directory path', async () => {
      const nodeModulesRealpath = resolve(cwd(), mockDirPath, 'node_modules');
      const binRealpath = resolve(nodeModulesRealpath, './bin');
      yarnCmdMock.mockResult(binRealpath);

      const result = await adapter.getNodeModulesDirPath();

      expect(result).toEqual(nodeModulesRealpath);
    });
  });

  describe('isMonorepo', () => {
    it('should retrieve true if given directory patrh is a monorepo', async () => {
      yarnCmdMock.mockResult('{}');

      const result = await adapter.isMonorepo();

      expect(result).toEqual(true);
    });

    it('should retrieve false if given directory patrh is a not monorepo', async () => {
      yarnCmdMock.mockError('Cannot find the root of your workspace');

      const result = await adapter.isMonorepo();

      expect(result).toEqual(false);
    });
  });
});
