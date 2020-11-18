import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import inquirer from 'inquirer';

import container from '../../container';
import { DirResult, createTmpDir } from '../../tests/tmp-dir';
import CreateCrudComponent from './CreateCrudComponent';

describe('createCrudComponent', () => {
  let createCrudComponent: CreateCrudComponent;

  let testDir: DirResult;
  let promptMock: jest.Mock;

  beforeAll(async () => {
    jest.mock('inquirer');
    promptMock = jest.fn();
    (inquirer.prompt as unknown) = promptMock;

    createCrudComponent = container.get(CreateCrudComponent);
  });

  afterEach(() => {
    testDir && testDir.removeCallback();
  });

  describe('construct', () => {
    it('should be initialized', () => {
      expect(createCrudComponent).toBeInstanceOf(CreateCrudComponent);
    });
  });

  describe('run', () => {
    it('should create all crud components files', async () => {
      testDir = createTmpDir();
      const testDirPath = testDir.name;

      (inquirer.prompt as unknown) = jest.fn().mockResolvedValue({ action: 'overwrite' });

      await createCrudComponent.run({
        realpath: testDirPath,
        name: 'test entity',
      });

      const expectedFiles = [
        'src/i18n/i18n.ts',
        'src/i18n/locales/en/test-entities.json',
        'src/i18n/locales/fr/test-entities.json',
        'src/views/test-entities/create-test-entity/CreateTestEntity.test.tsx',
        'src/views/test-entities/create-test-entity/CreateTestEntity.tsx',
        'src/views/test-entities/delete-test-entity/DeleteTestEntity.test.tsx',
        'src/views/test-entities/delete-test-entity/DeleteTestEntity.tsx',
        'src/views/test-entities/list-test-entities/ListTestEntities.test.tsx',
        'src/views/test-entities/list-test-entities/ListTestEntities.tsx',
        'src/views/test-entities/read-test-entity/ReadTestEntity.test.tsx',
        'src/views/test-entities/read-test-entity/ReadTestEntity.tsx',
        'src/views/test-entities/update-test-entity/UpdateTestEntity.test.tsx',
        'src/views/test-entities/update-test-entity/UpdateTestEntity.tsx',
        'src/views/test-entities/TestEntities.test.tsx',
        'src/views/test-entities/TestEntities.tsx',
        'src/views/test-entities/TestEntitiesConfig.tsx',
      ];

      for (const expectedFile of expectedFiles) {
        const filePath = resolve(testDirPath, expectedFile);
        expect(existsSync(filePath)).toBe(true);
        expect(readFileSync(filePath, 'utf-8')).toMatchSnapshot();
      }
    });
  });
});
