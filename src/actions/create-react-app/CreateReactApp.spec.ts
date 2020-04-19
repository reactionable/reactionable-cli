import CreateReactApp from './CreateReactApp';
import mock from 'mock-fs';
import { join } from 'path';
import inquirer from 'inquirer';

import container from '../../container';

describe('CreateReactApp', () => {
  let createReactApp: CreateReactApp;

  beforeAll(() => {
    createReactApp = container.get(CreateReactApp);
    jest.mock('inquirer');
  });

  afterEach(mock.restore);
  afterAll(jest.resetAllMocks);

  describe('checkIfReactAppExistsAlready', () => {
    it('should return false if the given realpath is not an existing directory', async () => {
      const dirPath = 'test/dir/path';

      mock({ [dirPath]: {} });

      const result = await createReactApp.checkIfReactAppExistsAlready(
        join(dirPath, 'app')
      );
      expect(result).toEqual(false);
    });

    it('should require confirmation for overriding existing directory', async () => {
      const dirPath = 'test/dir/path';

      mock({ [dirPath]: {} });

      (inquirer.prompt as any) = jest.fn().mockResolvedValue({});
      await createReactApp.checkIfReactAppExistsAlready(dirPath);
      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('should return undefined if user do not want overriding existing directory', async () => {
      const dirPath = 'test/dir/path';

      mock({ [dirPath]: {} });

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: false });
      const result = await createReactApp.checkIfReactAppExistsAlready(dirPath);
      expect(result).toBeUndefined();
    });

    it('should return false if directory exists but do not have expected files', async () => {
      const dirPath = 'test/dir/path';

      mock({ [dirPath]: {} });

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: true });

      const result = await createReactApp.checkIfReactAppExistsAlready(dirPath);
      expect(result).toEqual(false);
    });

    it('should return true if directory exists and have expected files', async () => {
      const dirPath = 'test/dir/path';

      mock({
        [dirPath]: {
          'package.json': JSON.stringify({
            dependencies: {
              react: '1.0.0',
            },
          }),
          src: {
            'react-app-env.d.ts': '',
          },
        },
      });

      (inquirer.prompt as any) = jest
        .fn()
        .mockResolvedValue({ override: true });

      const result = await createReactApp.checkIfReactAppExistsAlready(dirPath);
      expect(result).toEqual(true);
    });
  });
});
