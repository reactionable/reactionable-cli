import { join } from 'path';

import inquirer from 'inquirer';

import container from '../../../../container';
import { mockYarnCmd, restoreMockCmd } from '../../../../tests/mock-cmd';
import { mockDir, mockDirPath, mockYarnDir, restoreMockFs } from '../../../../tests/mock-fs';
import CreateNextApp from './CreateNextApp';

describe('CreateNextApp', () => {
  let createNextApp: CreateNextApp;

  beforeAll(() => {
    createNextApp = container.get(CreateNextApp);
    jest.mock('inquirer');
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

    it('should require confirmation for overriding existing directory', async () => {
      mockDir();

      (inquirer.prompt as unknown) = jest.fn().mockResolvedValue({});
      await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('should return undefined if user do not want overriding existing directory', async () => {
      mockDir();

      (inquirer.prompt as unknown) = jest.fn().mockResolvedValue({ override: false });
      const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(result).toBeUndefined();
    });

    it('should return false if directory exists but do not have expected files', async () => {
      mockDir();

      (inquirer.prompt as unknown) = jest.fn().mockResolvedValue({ override: true });

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

      (inquirer.prompt as unknown) = jest.fn().mockResolvedValue({ override: true });

      const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
      expect(result).toEqual(true);
    });
  });
});
