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

  describe('renderTemplate', () => {
    it('should create a file from given namespace', async () => {
      testDir = createTmpDir(false);

      const testDirPath = testDir.name;
      const templateContext = {
        projectName: 'test-project',
        i18nPath: 'src/i18n',
      };

      await service.renderTemplate(testDirPath, 'i18n', templateContext);

      const expectedI18nFile = resolve(testDirPath, 'src/i18n/i18n.ts');
      expect(existsSync(expectedI18nFile)).toBe(true);
      expect(readFileSync(expectedI18nFile, 'utf-8')).toMatchSnapshot();

      const expectedTranslationFile = resolve(testDirPath, 'src/i18n/locales/en/common.json');
      expect(existsSync(expectedTranslationFile)).toBe(true);
      expect(readFileSync(expectedTranslationFile, 'utf-8')).toMatchSnapshot();
    });

    it('should create a file from given namespace having nested config', async () => {
      testDir = createTmpDir(false);

      const testDirPath = testDir.name;
      const templateContext = {
        componentDirPath: resolve(testDirPath, 'src/components/test-component'),
        i18nPath: 'src/i18n',
        entityName: 'TestEntity',
        entitiesName: 'TestEntities',
      };

      await service.renderTemplate(testDir.name, 'create-component/crud', templateContext);

      const expectedConfigFile = resolve(
        testDirPath,
        'src/components/test-component/TestEntitiesConfig.tsx'
      );
      expect(existsSync(expectedConfigFile)).toBe(true);
      expect(readFileSync(expectedConfigFile, 'utf-8')).toMatchSnapshot('TestEntitiesConfig.tsx');

      const expectedTranslationFile = resolve(testDirPath, 'src/i18n/locales/en/testEntities.json');
      expect(existsSync(expectedTranslationFile)).toBe(true);
      expect(readFileSync(expectedTranslationFile, 'utf-8')).toMatchSnapshot('testEntities.json');
    });
  });

  describe('createFileFromTemplate', () => {
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
