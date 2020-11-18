import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import container from '../../container';
import { DirResult, createTmpDir } from '../../tests/tmp-dir';
import CreateComponent from './CreateComponent';

describe('createComponent', () => {
  let createComponent: CreateComponent;

  let testDir: DirResult;

  beforeAll(async () => {
    createComponent = container.get(CreateComponent);
  });

  afterEach(() => {
    testDir && testDir.removeCallback();
  });

  describe('construct', () => {
    it('should be initialized', () => {
      expect(createComponent).toBeInstanceOf(CreateComponent);
    });
  });

  describe('run', () => {
    it('should create expected components files', async () => {
      testDir = createTmpDir();
      const testDirPath = testDir.name;

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
      testDir = createTmpDir();
      const testDirPath = testDir.name;

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
