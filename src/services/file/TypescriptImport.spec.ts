import { TypescriptImport } from './TypescriptImport';

describe('Services - File - TypescriptImport', () => {
  describe('fromString', () => {
    it('should retrieve an instance of TypescriptImport from a given "glob" import string', async () => {
      const importString = `import * as serviceWorker from './serviceWorker';`;

      const typescriptImport = TypescriptImport.fromString(importString)!;

      expect(typescriptImport.packageName).toEqual('./serviceWorker');
      expect(typescriptImport.modules).toEqual({ '*': 'serviceWorker' });
      expect(typescriptImport.toString()).toEqual(importString);
    });

    it('should retrieve an instance of TypescriptImport from given an "aliased" import string', async () => {
      const importString = `import { App as CoreApp } from '@reactionable/core';`;

      const typescriptImport = TypescriptImport.fromString(importString)!;

      expect(typescriptImport.packageName).toEqual('@reactionable/core');
      expect(typescriptImport.modules).toEqual({ App: 'CoreApp' });
      expect(typescriptImport.toString()).toEqual(importString);
    });

    it('should retrieve an instance of TypescriptImport from given import file string', async () => {
      const importString = `import './index.scss';`;

      const typescriptImport = TypescriptImport.fromString(importString)!;

      expect(typescriptImport.packageName).toEqual('./index.scss');
      expect(typescriptImport.modules).toEqual({
        [TypescriptImport.defaultImport]: TypescriptImport.defaultImport,
      });
      expect(typescriptImport.toString()).toEqual(importString);
    });
  });

  describe('toString', () => {
    it('should retrieve a "glob" import string', async () => {
      const typescriptImport = new TypescriptImport('./serviceWorker', {
        '*': 'serviceWorker',
      });

      const importString = typescriptImport.toString();

      expect(importString).toEqual(
        `import * as serviceWorker from './serviceWorker';`
      );
    });

    it('should retrieve an "aliased" import string', async () => {
      const typescriptImport = new TypescriptImport('@reactionable/core', {
        App: 'CoreApp',
      });

      const importString = typescriptImport.toString();

      expect(importString).toEqual(
        `import { App as CoreApp } from '@reactionable/core';`
      );
    });
  });
});
