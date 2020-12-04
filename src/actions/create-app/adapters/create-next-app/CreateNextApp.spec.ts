import { join } from 'path';

import prompts from 'prompts';

import container from '../../../../container';
import { mockYarnCmd, restoreMockCmd } from '../../../../tests/mock-cmd';
import { mockDir, mockDirPath, mockYarnDir, restoreMockFs } from '../../../../tests/mock-fs';
import CreateNextApp from './CreateNextApp';

describe('CreateNextApp', () => {
  let createNextApp: CreateNextApp;

  beforeAll(() => {
    createNextApp = container.get(CreateNextApp);
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  afterAll(jest.resetAllMocks);

  describe('checkIfAppExistsAlready', () => {
    it('should return false if the given realpath is not an existing directory', async () => {
      mockDir();

      const result = await createNextApp.checkIfAppExistsAlready(join(mockDirPath, 'app'));
      expect(result).toEqual(false);
    });

    it('should return undefined if user do not want overriding existing directory', async () => {
      mockDir();

      prompts.inject([false]);
      const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(result).toBeUndefined();
    });

    it('should return false if directory exists but do not have expected files', async () => {
      mockDir();

      prompts.inject([true]);

      const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(result).toEqual(false);
    });

    it('should return true if directory exists and have expected files', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            next: '1.0.0',
          },
        }),
      });

      prompts.inject([true]);

      const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(result).toEqual(true);
    });
  });
});
