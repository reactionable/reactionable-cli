import container from '../../container';
import { mockYarnCmd, mockYarnWorkspacesInfoCmd, restoreMockCmd } from '../../tests/mock-cmd';
import {
  mockDirPath,
  mockMonorepoPackageDirName,
  mockMonorepoPackageDirPath,
  mockMonorepoRootName,
  mockPackageName,
  mockYarnDir,
  mockYarnMonorepoDir,
  restoreMockFs,
} from '../../tests/mock-fs';
import { PackageManagerService, PackageManagerType } from './PackageManagerService';

describe('packageManagerService', () => {
  let service: PackageManagerService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(PackageManagerService);
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
    container.restore();
  });

  describe('getAvailablePackageManagers', () => {
    it('should retrieve installed package managers', () => {
      const result = service.getAvailablePackageManagers();
      expect(result).toEqual([PackageManagerType.yarn, PackageManagerType.npm]);
    });
  });

  describe('getPackageName', () => {
    it('should return package name', async () => {
      const packageName = 'test-package';
      mockYarnDir({ 'package.json': JSON.stringify({ name: packageName }) });
      mockYarnCmd();

      const result = await service.getPackageName(mockDirPath);

      expect(result).toEqual(packageName);
    });

    it('should return package name for a monorepo package', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await service.getPackageName(mockMonorepoPackageDirPath);

      expect(result).toEqual(`${mockMonorepoRootName} - ${mockPackageName}`);
    });

    it('should return formated package name', async () => {
      const packageName = 'test-package';
      mockYarnDir({
        'package.json': JSON.stringify({ name: packageName }),
      });
      mockYarnWorkspacesInfoCmd();

      const result = await service.getPackageName(mockDirPath, 'camelize');

      expect(result).toEqual('testPackage');
    });

    it('should return "not full" package name', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await service.getPackageName(mockMonorepoPackageDirPath, undefined, false);

      expect(result).toEqual(mockPackageName);
    });
  });

  describe('hasInstalledPackage', () => {
    const packageName = 'test-package';
    it('should return false if given package is not installed', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({}),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(false);
    });

    it('should return true if given package is installed', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(true);
    });

    it('should return true if given package is installed for dev', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          devDependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName, true);

      expect(result).toEqual(true);
    });

    it('should return false if given package is not installed for dev', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
          devDependencies: {},
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName, true);

      expect(result).toEqual(false);
    });
  });

  describe('hasPackageJsonConfig', () => {
    const packageName = 'test-package';
    it('should return false if given package is not installed', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({}),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(false);
    });

    it('should return true if given package is installed', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName);

      expect(result).toEqual(true);
    });

    it('should return true if given package is installed for dev', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          devDependencies: {
            [packageName]: '1.0.0',
          },
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName, true);

      expect(result).toEqual(true);
    });

    it('should return false if given package is not installed for dev', async () => {
      mockYarnCmd();
      mockYarnDir({
        'package.json': JSON.stringify({
          dependencies: {
            [packageName]: '1.0.0',
          },
          devDependencies: {},
        }),
      });

      const result = await service.hasInstalledPackage(mockDirPath, packageName, true);

      expect(result).toEqual(false);
    });
  });
});
