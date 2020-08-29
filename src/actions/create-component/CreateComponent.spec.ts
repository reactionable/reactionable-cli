import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { sync } from 'rimraf';

import container from '../../container';
import CreateComponent from './CreateComponent';

describe('CreateComponent', () => {
  let createComponent: CreateComponent;

  const testDirPath = '__tests__/test-project';

  const cleanTestDir = async () => {
    const testComponentDirPath = resolve(testDirPath, 'src');
    await sync(testComponentDirPath);
  };

  beforeAll(() => {
    createComponent = container.get(CreateComponent);
  });

  beforeEach(cleanTestDir);
  afterAll(cleanTestDir);

  describe('construct', () => {
    it('should be initialized ', () => {
      expect(createComponent).toBeInstanceOf(CreateComponent);
    });
  });

  describe('run', () => {
    it('should create expected components files', async () => {
      mkdirSync(join(testDirPath, 'src/views/test-component'), {
        recursive: true,
      });

      await createComponent.run({
        realpath: testDirPath,
        name: 'test component',
      });

      const expectedFiles = [
        'views/test-component/TestComponent.test.tsx',
        'views/test-component/TestComponent.tsx',
      ];

      for (const expectedFile of expectedFiles) {
        const filePath = resolve(testDirPath, 'src', expectedFile);
        expect(existsSync(filePath)).toBe(true);
        expect(readFileSync(filePath, 'utf-8')).toMatchSnapshot();
      }
    });

    it('should create expected App component files', async () => {
      mkdirSync(join(testDirPath, 'src'), { recursive: true });

      await createComponent.run({
        realpath: testDirPath,
        name: 'App',
      });

      const expectedFiles = ['App.test.tsx', 'App.tsx'];

      for (const expectedFile of expectedFiles) {
        const filePath = resolve(testDirPath, 'src', expectedFile);
        expect(existsSync(filePath)).toBe(true);
        expect(readFileSync(filePath, 'utf-8')).toMatchSnapshot();
      }
    });
  });
});
