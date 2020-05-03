import container from '../../container';
import {
  restoreMockFs,
  mockDir,
  mockDirPath,
  mockYarnDir,
  mockNpmDir,
  mockPackageName,
  mockYarnMonorepoDir,
  mockMonorepoPackageDirName,
  mockMonorepoRootName,
  mockMonorepoPackageDirPath,
} from '../../tests/mock-fs';
import {
  PackageManagerService,
  PackageManagerType,
} from './PackageManagerService';
import { YarnPackageManager } from './adapters/YarnPackageManager';
import { NpmPackageManager } from './adapters/NpmPackageManager';
import { MockedCmd, mockYarnCmd, restoreMockCmd } from '../../tests/mock-cmd';

describe('PackageManagerService', () => {
  let yarnCmdMock: MockedCmd;
  let service: PackageManagerService;

  beforeAll(() => {
    jest.mock('inquirer');
  });

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(PackageManagerService);
    yarnCmdMock = mockYarnCmd();
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
    container.restore();
  });

  describe('getAvailablePackageManagers', () => {
    it('should retrieve installed package managers', async () => {
      const result = await service.getAvailablePackageManagers();
      expect(result).toEqual([PackageManagerType.yarn, PackageManagerType.npm]);
    });
  });

  describe('getPackageName', () => {
    it('should return package name', async () => {
      const packageName = 'test-package';
      mockYarnDir({
        'package.json': JSON.stringify({
          name: packageName,
        }),
      });

      const result = await service.getPackageName(mockDirPath);

      expect(result).toEqual(packageName);
    });

    it('should return package name for a monorepo package', async () => {
      mockYarnMonorepoDir();
      const yarnCmdMock = mockYarnCmd();
      yarnCmdMock.mockResult(
        JSON.stringify({
          [mockPackageName]: {
            location: `packages/${mockMonorepoPackageDirName}`,
          },
        })
      );

      const result = await service.getPackageName(mockMonorepoPackageDirPath);

      expect(result).toEqual(`${mockMonorepoRootName} - ${mockPackageName}`);
    });

    it('should return formated package name', async () => {
      const packageName = 'test-package';
      mockYarnDir({
        'package.json': JSON.stringify({ name: packageName }),
      });
      yarnCmdMock.mockResult('{}');

      const result = await service.getPackageName(mockDirPath, 'camelize');

      expect(result).toEqual('testPackage');
    });

    it('should return "not full" package name', async () => {
      mockYarnMonorepoDir();
      const yarnCmdMock = mockYarnCmd();
      yarnCmdMock.mockResult(
        JSON.stringify({
          [mockPackageName]: {
            location: `packages/${mockMonorepoPackageDirName}`,
          },
        })
      );

      const result = await service.getPackageName(
        mockMonorepoPackageDirPath,
        undefined,
        false
      );

      expect(result).toEqual(mockPackageName);
    });
  });

  describe('hasInstalledPackage', () => {
    const packageName = 'test-package';
    it('should return false if given package is not installed', () => {
      mockYarnDir({
        'package.json': JSON.stringify({}),
      });

      const result = service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(false);
    });

    it('should return true if given package is installed', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(true);
    });

    it('should return true if given package is installed for dev', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          devDependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = service.hasInstalledPackage(
        mockDirPath,
        packageName,
        true
      );

      expect(result).toEqual(true);
    });

    it('should return false if given package is not installed for dev', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
          devDependencies: {},
        }),
      });

      const result = service.hasInstalledPackage(
        mockDirPath,
        packageName,
        true
      );

      expect(result).toEqual(false);
    });
  });

  describe('hasPackageJsonConfig', () => {
    const packageName = 'test-package';
    it('should return false if given package is not installed', () => {
      mockYarnDir({
        'package.json': JSON.stringify({}),
      });

      const result = service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(false);
    });

    it('should return true if given package is installed', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(true);
    });

    it('should return true if given package is installed for dev', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          devDependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = service.hasInstalledPackage(
        mockDirPath,
        packageName,
        true
      );

      expect(result).toEqual(true);
    });

    it('should return false if given package is not installed for dev', () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
          devDependencies: {},
        }),
      });

      const result = service.hasInstalledPackage(
        mockDirPath,
        packageName,
        true
      );

      expect(result).toEqual(false);
    });
  });
});
