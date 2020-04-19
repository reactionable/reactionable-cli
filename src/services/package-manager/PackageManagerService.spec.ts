import mock from 'mock-fs';

import container from '../../container';
import {
  PackageManagerService,
  PackageManagerType,
  PackageJson,
} from './PackageManagerService';
import { YarnPackageManager } from './adapters/YarnPackageManager';
import { NpmPackageManager } from './adapters/NpmPackageManager';

describe('PackageManagerService', () => {
  let service: PackageManagerService;

  const dirPath = 'test/dir/path';

  const mockYarnDir = () => mock({ [dirPath]: { 'yarn.lock': '' } });
  const mockNpmDir = () => mock({ [dirPath]: { 'package-lock.json': '' } });

  beforeAll(() => {
    jest.mock('inquirer');
  });

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(PackageManagerService);
  });

  afterEach(() => {
    mock.restore();
    container.restore();
  });

  describe('getAvailablePackageManagers', () => {
    it('should retrieve installed package managers', async () => {
      const result = await service.getAvailablePackageManagers();
      expect(result).toEqual([PackageManagerType.yarn, PackageManagerType.npm]);
    });
  });

  describe('getPackageManager', () => {
    it('should throw an error if given dir path does not exist', () => {
      const getPackageManagerOperation = () =>
        service.getPackageManager(dirPath);

      expect(getPackageManagerOperation).toThrowError(
        'Directory "test/dir/path" does not exist'
      );
    });

    it('should retrieve yarn when yarn.lock file exist', () => {
      mockYarnDir();

      const packageManager = service.getPackageManager(dirPath);
      expect(packageManager).toBeInstanceOf(YarnPackageManager);
    });

    it('should retrieve yarn when package-lock.json file exist', () => {
      mockNpmDir();

      const packageManager = service.getPackageManager(dirPath);
      expect(packageManager).toBeInstanceOf(NpmPackageManager);
    });

    it('should use existing package manager instance for same given dir path', () => {
      const newDirPath = 'test/new/dir/path';
      mock({ [newDirPath]: { 'yarn.lock': '' } });

      const packageManager = service.getPackageManager(newDirPath);

      const samePackageManager = service.getPackageManager(newDirPath);

      expect(samePackageManager).toBe(packageManager);
    });
  });

  describe('getPackageJsonData', () => {
    const packageJson: PackageJson = {
      name: 'test-package',
      version: '0.0.1',
      devDependencies: {
        'test-dependency': '1.0.0',
      },
      dependencies: {
        'test-dev-dependency': '1.0.0',
      },
    };
    it('should return all package.json data', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify(packageJson),
        },
      });

      const result = service.getPackageJsonData(dirPath);
      expect(result).toEqual(packageJson);
    });

    it('should return expected package.json data property', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify(packageJson),
        },
      });

      const result = service.getPackageJsonData(dirPath, 'name');
      expect(result).toEqual(packageJson.name);
    });
  });

  describe('hasInstalledPackage', () => {
    const packageName = 'test-package';
    it('should return false if given package is not installed', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({}),
        },
      });

      const result = service.hasInstalledPackage(dirPath, packageName);

      expect(result).toEqual(false);
    });

    it('should return true if given package is installed', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({
            dependencies: {
              [packageName]: '1.0.0',
            },
          }),
        },
      });

      const result = service.hasInstalledPackage(dirPath, packageName);

      expect(result).toEqual(true);
    });

    it('should return true if given package is installed for dev', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({
            devDependencies: {
              [packageName]: '1.0.0',
            },
          }),
        },
      });

      const result = service.hasInstalledPackage(dirPath, packageName, true);

      expect(result).toEqual(true);
    });

    it('should return false if given package is not installed for dev', () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({
            dependencies: {
              [packageName]: '1.0.0',
            },
            devDependencies: {},
          }),
        },
      });

      const result = service.hasInstalledPackage(dirPath, packageName, true);

      expect(result).toEqual(false);
    });
  });
});
