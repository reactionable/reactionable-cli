import { parse, AST_NODE_TYPES } from '@typescript-eslint/typescript-estree';
import { TypescriptImport, ITypescriptImport } from './TypescriptImport';
import { StdFile } from './StdFile';
import { EOL } from 'os';

export class TypescriptFile extends StdFile {
  protected imports?: Array<TypescriptImport>;
  protected declarations?: Array<string>;
  protected defaultDeclaration?: string | null;

  protected parseContent(content: string): string {
    content = super.parseContent(content);
    this.imports = [];
    this.declarations = [];
    this.defaultDeclaration = null;
    try {
      const { body } = parse(content, {
        jsx: true,
      });
      for (const bodyItem of body) {
        switch (bodyItem.type) {
          case 'ImportDeclaration':
            for (const specifier of bodyItem.specifiers) {
              let importType: string;
              let moduleName: string;
              switch (specifier.type) {
                case AST_NODE_TYPES.ImportDefaultSpecifier:
                  importType = TypescriptImport.defaultImport;
                  moduleName = specifier.local.name;
                  break;

                case AST_NODE_TYPES.ImportNamespaceSpecifier:
                  importType = specifier.local.name;
                  moduleName = TypescriptImport.globImport;
                  break;

                default:
                  importType =
                    specifier.local.name !== specifier.imported.name
                      ? specifier.local.name
                      : '';
                  moduleName = specifier.imported.name;
              }

              this.addImports([
                new TypescriptImport(bodyItem.source.value as string, {
                  [moduleName]: importType,
                }),
              ]);
            }
            break;
          default:
            this.declarations.push(
              content.substr(
                bodyItem.range[0],
                bodyItem.range[1] - bodyItem.range[0]
              )
            );
        }
      }
    } catch (error) {
      let contentError = content;
      if (error.lineNumber) {
        contentError = content.split('\n')[error.lineNumber - 1];
      }
      throw new Error(
        `An error occurred while parsing file content "${
          this.file
        }": ${JSON.stringify(error)} => "${contentError.trim()}"`
      );
    }
    return content;
  }

  getContent(): string {
    let importLines: string[] = [];
    if (this.imports) {
      this.imports.sort((importA, importB) => {
        if (/^\./.exec(importA.packageName)) {
          return 1;
        }
        if (/^\./.exec(importB.packageName)) {
          return -1;
        }
        return importA.packageName.localeCompare(importB.packageName);
      });
      importLines = this.imports
        .map((importItem) => importItem.toString())
        .filter((line) => !!line.length);
    }
    return [...importLines, '', ...(this.declarations || [])].join(EOL);
  }

  setImports(
    importsToAdd: Array<ITypescriptImport> = [],
    importsToRemove: Array<ITypescriptImport> = []
  ): this {
    const importToAddItems = importsToAdd.map(
      (importItem) =>
        new TypescriptImport(importItem.packageName, importItem.modules)
    );
    const importToRemoveItems = importsToRemove.map(
      (importItem) =>
        new TypescriptImport(importItem.packageName, importItem.modules)
    );

    this.addImports(importToAddItems);
    this.removeImports(importToRemoveItems);
    return this;
  }

  protected addImports(imports: TypescriptImport[]) {
    if (!this.imports) {
      this.imports = [];
    }
    for (const importItem of imports) {
      let importToAddFound = false;
      for (const typescriptImport of this.imports) {
        if (importItem.packageName !== typescriptImport.packageName) {
          continue;
        }
        typescriptImport.addModules(importItem.modules);
        importToAddFound = true;
      }
      if (!importToAddFound) {
        this.imports.push(importItem);
      }
    }
  }

  protected removeImports(imports: TypescriptImport[]) {
    if (!this.imports) {
      this.imports = [];
    }
    // Remove imports
    for (const importItem of imports) {
      for (const typescriptImport of this.imports) {
        if (importItem.packageName !== typescriptImport.packageName) {
          continue;
        }
        typescriptImport.removeModules(importItem.modules);
      }
    }
  }
}
