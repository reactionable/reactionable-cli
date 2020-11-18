import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import container from '../container';
import { DirResult, createTmpDir } from '../tests/tmp-dir';
import { TemplateService } from './TemplateService';

describe('templateService', () => {
  let testDir: DirResult;
  let service: TemplateService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(TemplateService);
  });

  afterEach(() => {
    container.restore();
    testDir && testDir.removeCallback();
  });

  describe('createFileFromTemplate', () => {
    it('should create a file from given template', async () => {
      testDir = createTmpDir(false);
      const testDirPath = testDir.name;

      await service.renderTemplateTree(testDirPath, 'i18n', {
        'src/i18n': ['i18n.ts'],
      });

      const expectedTestComponentFile = resolve(testDirPath, 'src/i18n/i18n.ts');
      expect(existsSync(expectedTestComponentFile)).toBe(true);
      expect(readFileSync(expectedTestComponentFile, 'utf-8')).toMatchSnapshot();
    });

    it('should create a file from given template file name different from target filename', async () => {
      testDir = createTmpDir(false);
      const testDirPath = testDir.name;

      await service.renderTemplateTree(
        testDirPath,
        'i18n/locales',
        {
          'src/i18n/locales': { 'en/common.json': 'en/common.json' },
        },
        { projectName: JSON.stringify('test-project') }
      );

      const expectedTestComponentFile = resolve(testDirPath, 'src/i18n/locales/en/common.json');
      expect(existsSync(expectedTestComponentFile)).toBe(true);
      expect(readFileSync(expectedTestComponentFile, 'utf-8')).toMatchSnapshot();
    });

    it('should throws an error if file directory does not exist', async () => {
      const createFileOperation = service.createFileFromTemplate(
        '/unexisting-directory/test.js',
        'test-namespace',
        {}
      );

      await expect(createFileOperation).rejects.toThrow(
        `Unable to create file "/unexisting-directory/test.js", directory "/unexisting-directory" does not exist`
      );
    });
  });
});
