import CreateComponent from './CreateComponent';
import container from '../../container';
import { resolve } from 'path';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';

describe('CreateComponent', () => {
  let createComponent: CreateComponent;

  const testDirPath = '__tests__/test-project';

  const cleanTesttDir = async () => {
    const testComponentDirPath = resolve(
      testDirPath,
      'src/views/test-component'
    );
    const rimraf = promisify(require('rimraf'));
    await rimraf(testComponentDirPath);
  };

  beforeAll(() => {
    createComponent = container.get(CreateComponent);
  });

  beforeEach(cleanTesttDir);
  afterAll(cleanTesttDir);

  describe('construct', () => {
    it('should be initialized ', () => {
      expect(createComponent).toBeInstanceOf(CreateComponent);
    });
  });

  describe('run', () => {
    it('should create expected components files', async () => {
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
  });
});
