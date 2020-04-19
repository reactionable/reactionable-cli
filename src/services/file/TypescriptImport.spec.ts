import { TypescriptImport } from './TypescriptImport';

describe('Services - File - TypescriptImport', () => {
  describe('fromString', () => {
    it('should retrieve an instance of TypescriptImport from given string', async () => {
      const importString = `import * as serviceWorker from './serviceWorker';`;

      const typescriptImport = TypescriptImport.fromString(importString)!;

      expect(typescriptImport.packageName).toEqual('./serviceWorker');
      expect(typescriptImport.modules).toEqual({ '*': 'serviceWorker' });
      expect(typescriptImport.toString()).toEqual(importString);
    });
  });

  describe('toString', () => {
    it('should retrieve an import string', async () => {
      const typescriptImport = new TypescriptImport('./serviceWorker', {
        '*': 'serviceWorker',
      });

      const importString = typescriptImport.toString();

      expect(importString).toEqual(
        `import * as serviceWorker from './serviceWorker';`
      );
    });
  });
});
