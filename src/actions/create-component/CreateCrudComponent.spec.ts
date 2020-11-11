import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { sync } from 'rimraf';

import container from '../../container';
import CreateCrudComponent from './CreateCrudComponent';

describe('createCrudComponent', () => {
  let createCrudComponent: CreateCrudComponent;

  const testDirPath = resolve('__tests__/test-project');

  const cleanTestDir = async () => {
    const testComponentDirPath = resolve(testDirPath, 'src');
    await sync(testComponentDirPath);
  };

  beforeAll(() => {
    createCrudComponent = container.get(CreateCrudComponent);
  });

  beforeEach(cleanTestDir);
  afterEach(cleanTestDir);

  describe('construct', () => {
    it('should be initialized', () => {
      expect(createCrudComponent).toBeInstanceOf(CreateCrudComponent);
    });
  });

  describe('run', () => {
    it('should create all crud components files', async () => {
      const testComponentDirPath = join(testDirPath, 'src/views/test-entities');
      mkdirSync(testComponentDirPath, { recursive: true });
      expect(existsSync(testComponentDirPath)).toBe(true);

      await createCrudComponent.run({
        realpath: testDirPath,
        name: 'test entity',
      });

      const expectedFiles = [
        'create-test-entity/CreateTestEntity.test.tsx',
        'create-test-entity/CreateTestEntity.tsx',
        'delete-test-entity/DeleteTestEntity.test.tsx',
        'delete-test-entity/DeleteTestEntity.tsx',
        'list-test-entities/ListTestEntities.test.tsx',
        'list-test-entities/ListTestEntities.tsx',
        'read-test-entity/ReadTestEntity.test.tsx',
        'read-test-entity/ReadTestEntity.tsx',
        'update-test-entity/UpdateTestEntity.test.tsx',
        'update-test-entity/UpdateTestEntity.tsx',
        'TestEntities.test.tsx',
        'TestEntities.tsx',
        'TestEntitiesConfig.tsx',
      ];

      for (const expectedFile of expectedFiles) {
        const filePath = resolve(testDirPath, 'src/views/test-entities', expectedFile);
        expect(existsSync(filePath)).toBe(true);
        expect(readFileSync(filePath, 'utf-8')).toMatchSnapshot();
      }
    });
  });
});
