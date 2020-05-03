import { join } from 'path';
import inquirer from 'inquirer';

import container from '../../container';
import {
  restoreMockFs,
  mockDir,
  mockDirPath,
  mockYarnDir,
} from '../../tests/mock-fs';
import CreateReactApp from './CreateReactApp';

describe('CreateReactApp', () => {
  let createReactApp: CreateReactApp;

  beforeAll(() => {
    createReactApp = container.get(CreateReactApp);
    jest.mock('inquirer');
  });

  afterEach(restoreMockFs);
  afterAll(jest.resetAllMocks);

  describe('checkIfReactAppExistsAlready', () => {
    it('should return false if the given realpath is not an existing directory', async () => {
      mockDir();

      const result = await createReactApp.checkIfReactAppExistsAlready(
        join(mockDirPath, 'app')
      );
      expect(result).toEqual(false);
    });

    it('should require confirmation for overriding existing directory', async () => {
      mockDir();

      (inquirer.prompt as any) = jest.fn().mockResolvedValue({});
      await createReactApp.checkIfReactAppExistsAlready(mockDirPath);
      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('should return undefined if user do not want overriding existing directory', async () => {
      mockDir();

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: false });
      const result = await createReactApp.checkIfReactAppExistsAlready(
        mockDirPath
      );
      expect(result).toBeUndefined();
    });

    it('should return false if directory exists but do not have expected files', async () => {
      mockDir();

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: true });

      const result = await createReactApp.checkIfReactAppExistsAlready(
        mockDirPath
      );
      expect(result).toEqual(false);
    });

    it('should return true if directory exists and have expected files', async () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            react: '1.0.0',
          },
        }),
        src: {
          'react-app-env.d.ts': '',
        },
      });

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: true });

      const result = await createReactApp.checkIfReactAppExistsAlready(
        mockDirPath
      );
      expect(result).toEqual(true);
    });
  });
});
