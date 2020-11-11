import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { sync } from 'rimraf';

import container from '../../container';
import CreateComponent from './CreateComponent';

describe('createComponent', () => {
  let createComponent: CreateComponent;

  const testDirPath = resolve('__tests__/test-project');

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
    it('should be initialized', () => {
      expect(createComponent).toBeInstanceOf(CreateComponent);
    });
  });

  describe('run', () => {
    it('should create expected components files', async () => {
      const testComponentDirPath = join(testDirPath, 'src/views/test-component');
      mkdirSync(testComponentDirPath, { recursive: true });
      expect(existsSync(testComponentDirPath)).toBe(true);

      await createComponent.run({
        realpath: testDirPath,
        name: 'test component',
      });

      const expectedComponentFile = resolve(
        testDirPath,
        'src/views/test-component/TestComponent.tsx'
      );
      expect(existsSync(expectedComponentFile)).toBe(true);
      expect(readFileSync(expectedComponentFile, 'utf-8')).toMatchSnapshot();
      const expectedTestComponentFile = resolve(
        testDirPath,
        'src/views/test-component/TestComponent.test.tsx'
      );
      expect(existsSync(expectedTestComponentFile)).toBe(true);
      expect(readFileSync(expectedTestComponentFile, 'utf-8')).toMatchSnapshot();
    });

    it('should create expected App component files', async () => {
      const appComponentDirPath = join(testDirPath, 'src');
      mkdirSync(appComponentDirPath, { recursive: true });
      expect(existsSync(appComponentDirPath)).toBe(true);

      await createComponent.run({
        realpath: testDirPath,
        name: 'App',
      });

      const expectedAppFile = resolve(testDirPath, 'src/App.tsx');
      expect(existsSync(expectedAppFile)).toBe(true);
      expect(readFileSync(expectedAppFile, 'utf-8')).toMatchSnapshot();

      const expectedTestAppFile = resolve(testDirPath, 'src/App.test.tsx');
      expect(existsSync(expectedTestAppFile)).toBe(true);
      expect(readFileSync(expectedTestAppFile, 'utf-8')).toMatchSnapshot();
    });
  });
});
