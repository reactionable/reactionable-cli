export interface ITypescriptImport {
  packageName: string;
  modules: ITypescriptImportModules;
}

export type ITypescriptImportModules = { [key: string]: string };

export class TypescriptImport {
  static readonly globImport = '*';
  static readonly defaultImport = 'default';

  constructor(
    public packageName: string,
    public modules: ITypescriptImportModules
  ) {}

  static fromString(line: string): TypescriptImport | null {
    const importRegex = /^\s*import\s(.+)\sfrom\s+['"](.+)['"]\s*;?$/;
    const matches = importRegex.exec(line.trim());
    if (!matches) {
      return null;
    }
    return new TypescriptImport(
      matches[2],
      TypescriptImport.parseImportModules(matches[1])
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

  private static parseImportModule(
    importModule: string,
    defaultAs: string = ''
  ): ITypescriptImportModules {
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

  addModules(modules: ITypescriptImportModules) {
    this.modules = Object.assign(this.modules, modules);
  }

  removeModules(modulesToRemove: ITypescriptImportModules) {
    for (const moduleName of Object.keys(this.modules)) {
      for (const moduleToRemove of Object.keys(modulesToRemove)) {
        if (moduleName === moduleToRemove) {
          delete this.modules[moduleName];
        }
      }
    }
  }

  toString() {
    let defaultImport: string = '';
    let globImport: string = '';
    const brakesImports: string[] = [];

    const orderedModules: ITypescriptImportModules = {};
    Object.keys(this.modules)
      .sort()
      .forEach(function (key) {
        orderedModules[key] = orderedModules[key];
      });

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
      imports += `${imports.length > 0 ? ', ' : ''}${
        TypescriptImport.globImport
      } as ${globImport}`;
    }
    if (brakesImports.length) {
      imports += `${imports.length > 0 ? ', ' : ''}{ ${brakesImports.join(
        ', '
      )} }`;
    }
    return imports.length
      ? `import ${imports} from '${this.packageName}';`
      : '';
  }
}
