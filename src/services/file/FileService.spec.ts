import { join, resolve } from 'path';

import container from '../../container';
import { FileService } from './FileService';

const testDirPath = '__tests__/test-project';

describe('fileService', () => {
  let service: FileService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(FileService);
  });

  afterEach(() => {
    container.restore();
  });

  describe('fileExistsSync', () => {
    it('should return true when the given path is an existing file', async () => {
      const fileExists = service.fileExistsSync(join(testDirPath, 'package.json'));
      expect(fileExists).toBe(true);
    });
    it('should return false when the given path is not an existing file', async () => {
      const fileExists = service.fileExistsSync(join(testDirPath, 'unexisting-file.test'));
      expect(fileExists).toBe(false);
    });
  });

  describe('dirExistsSync', () => {
    it('should return true when the given path is an existing directory', async () => {
      const dirExists = service.dirExistsSync(testDirPath);
      expect(dirExists).toBe(true);
    });
    it('should return false when the given path is not an existing directory', async () => {
      const dirExists = service.dirExistsSync('/unexisting-directory');
      expect(dirExists).toBe(false);
    });
  });

  describe('fileDirExistsSync', () => {
    it('should return true when the given path directory exists', async () => {
      const dirExists = service.fileDirExistsSync(join(testDirPath, 'package.json'));
      expect(dirExists).toBe(true);
    });
    it('should return false when the given path directory does not exist', async () => {
      const dirExists = service.fileDirExistsSync(join('/unexisting-directory', 'package.json'));
      expect(dirExists).toBe(false);
    });
  });

  describe('assertDirExists', () => {
    it('should return the directory realpath when the given path is an existing directory', async () => {
      const dirRealpath = service.assertDirExists(testDirPath);
      expect(dirRealpath).toEqual(resolve(testDirPath));
    });
    it('should throw an error when the given path is not an existing directory', async () => {
      const assertDirExistsOperation = () => {
        service.assertDirExists('/unexisting-directory');
      };
      expect(assertDirExistsOperation).toThrow(
        'Directory "/unexisting-directory" does not exist'
      );
    });
  });

  describe('assertFileExists', () => {
    it('should return the fileectory realpath when the given path is an existing file', async () => {
      const testFilePath = join(testDirPath, 'package.json');
      const fileRealpath = service.assertFileExists(testFilePath);
      expect(fileRealpath).toEqual(resolve(testFilePath));
    });
    it('should throw an error when the given path is not an existing file', async () => {
      const testFilePath = join('/unexisting-fileectory', 'package.json');
      const assertFileExistsOperation = () => {
        service.assertFileExists(testFilePath);
      };
      expect(assertFileExistsOperation).toThrow(`File "${testFilePath}" does not exist`);
    });
  });

  describe('replaceFileExtension', () => {
    it('should not throw an error when the given path is not an existing file', async () => {
      const testFilePath = join('/unexisting-fileectory', 'package.json');
      const result = service.replaceFileExtension(testFilePath, 'ts');
      expect(result).toBeUndefined();
    });

    it('should throw an error when the given path is not an existing file but must exist', async () => {
      const testFilePath = join('/unexisting-fileectory', 'package.json');
      const replaceFileExtensionOperation = () => {
        service.replaceFileExtension(testFilePath, 'ts', true);
      };
      expect(replaceFileExtensionOperation).toThrow(`File "${testFilePath}" does not exist`);
    });
  });
});
