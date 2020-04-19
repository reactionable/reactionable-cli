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
});
