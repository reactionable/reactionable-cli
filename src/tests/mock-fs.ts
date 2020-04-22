import mockFs from 'mock-fs';
import FileSystem from 'mock-fs/lib/filesystem';
import { PackageJson } from '../services/package-manager/PackageManagerService';

let logsTemp: any[] = [];
let logMock: any;

function mock(
  config?: FileSystem.DirectoryItems,
  options?: FileSystem.Options
) {
  if (!logMock) {
    logMock = jest.spyOn(console, 'log').mockImplementation((...args) => {
      logsTemp.push(args);
    });
  }
  return mockFs(config, options);
}

export const mockDirPath = 'test/dir/path';
export function mockDir(
  config?: FileSystem.DirectoryItems,
  dirPath: string = mockDirPath
) {
  return mock({
    [dirPath]: config || {},
  });
}

function mockPackageDir(config?: FileSystem.DirectoryItems, dirPath?: string) {
  return mockDir(
    {
      'package.json': JSON.stringify({
        name: 'test-project',
      }),
      node_modules: {
        '.bin': {},
      },
      ...(config || {}),
    },
    dirPath
  );
}

export function mockYarnDir(
  config?: FileSystem.DirectoryItems,
  dirPath?: string
) {
  return mockPackageDir({ 'yarn.lock': '', ...(config || {}) }, dirPath);
}

export function mockNpmDir(
  config?: FileSystem.DirectoryItems,
  dirPath?: string
) {
  return mockPackageDir(
    { 'package-lock.json': '', ...(config || {}) },
    dirPath
  );
}

export function restoreMockFs() {
  if (logMock) {
    logMock.mockRestore();
    logMock = undefined;
  }
  logsTemp.map((el) => console.log(...el));
  logsTemp = [];
  mockFs.restore();
}
