export interface ITypescriptImport {
  packageName: string;
  modules: ITypescriptImportModules;
}

/**
 * Key is the name of the import and value is the alias.
 * Example:
 * import { Test } from 'xxxx'; => { Test: '' }
 * import { Test as TesAlias } from 'xxxx'; => { Test: 'TestAlias' }
 * import Test from 'xxxx'; => { Test: 'default' }
 *
 */
export type ITypescriptImportModules = { [key: string]: string };

export class TypescriptImport {
  static readonly globImport = '*';
  static readonly defaultImport = 'default';

  constructor(public packageName: string, public modules: ITypescriptImportModules) {}

  isLocal(): boolean {
    return !!/^\./.exec(this.packageName);
  }

  isDefaultImport(): boolean {
    return this.modules[TypescriptImport.defaultImport] === TypescriptImport.defaultImport;
  }

  static fromString(line: string): TypescriptImport | null {
    const importRegex = /^\s*import\s((.+)\sfrom\s+)?['"](.+)['"]\s*;?$/;
    const matches = importRegex.exec(line.trim());
    if (!matches) {
      return null;
    }

    return new TypescriptImport(
      matches[3].trim(),
      TypescriptImport.parseImportModules(matches[2]?.trim() || TypescriptImport.defaultImport)
    );
  }

  private static parseImportModules(modules: string): ITypescriptImportModules {
    let parsedPodules: ITypescriptImportModules = {};
    modules = modules.trim();
    const brakesMatches = /\{(.+)\}/.exec(modules);
    if (brakesMatches) {
      parsedPodules = Object.assign(
        parsedPodules,
        TypescriptImport.parseImportModule(brakesMatches[1])
      );
      modules = modules.replace(brakesMatches[0], '').trim();
    }
    if (modules.length) {
      parsedPodules = Object.assign(
        parsedPodules,
        TypescriptImport.parseImportModule(modules, 'default')
      );
    }
    return parsedPodules;
  }

  private static parseImportModule(importModule: string, defaultAs = ''): ITypescriptImportModules {
    const parsedPodules: ITypescriptImportModules = {};
    for (const modulePart of importModule.trim().split(',')) {
      if (!modulePart.length) {
        continue;
      }
      const moduleParts = modulePart.trim().split('as');
      parsedPodules[moduleParts[0].trim()] =
        moduleParts.length === 1 ? defaultAs : moduleParts[1].trim();
    }
    return parsedPodules;
  }

  addModules(modules: ITypescriptImportModules): void {
    this.modules = Object.assign(this.modules, modules);
  }

  removeModules(modulesToRemove: ITypescriptImportModules): void {
    for (const moduleName of Object.keys(this.modules)) {
      for (const moduleToRemove of Object.keys(modulesToRemove)) {
        if (moduleName === moduleToRemove) {
          delete this.modules[moduleName];
        }
      }
    }
  }

  toString(): string {
    let defaultImport = '';
    let globImport = '';
    const brakesImports: string[] = [];

    const orderedModules: ITypescriptImportModules = {};
    const moduleKeys = Object.keys(this.modules);
    moduleKeys.sort();
    for (const key of moduleKeys) {
      orderedModules[key] = this.modules[key];
    }

    for (const moduleName of Object.keys(orderedModules)) {
      if (this.modules[moduleName] === TypescriptImport.defaultImport) {
        if (defaultImport.length) {
          throw new Error(
            `Unable to have many imports for package "${this.packageName}": "${defaultImport}, ${moduleName}"`
          );
        }
        defaultImport = moduleName;
        continue;
      }
      if (moduleName === TypescriptImport.globImport) {
        if (globImport.length) {
          throw new Error(
            `Unable to have many glob imports for package "${this.packageName}": "${globImport}, ${moduleName}"`
          );
        }
        globImport = this.modules[moduleName];
        continue;
      }

      let brakesImport = moduleName;
      if (this.modules[moduleName].length) {
        brakesImport += ' as ' + this.modules[moduleName];
      }
      brakesImports.push(brakesImport);
    }

    let imports = defaultImport;

    if (globImport) {
      imports += `${imports.length > 0 ? ', ' : ''}${TypescriptImport.globImport} as ${globImport}`;
    }
    if (brakesImports.length) {
      imports += `${imports.length > 0 ? ', ' : ''}{ ${brakesImports.join(', ')} }`;
    }

    if (!imports.length) {
      return '';
    }

    if (imports === defaultImport && defaultImport === TypescriptImport.defaultImport) {
      return `import '${this.packageName}';`;
    }

    return `import ${imports} from '${this.packageName}';`;
  }
}
