import {
  ImportDeclaration,
  NodeArray,
  ScriptTarget,
  Statement,
  SyntaxKind,
  createSourceFile,
} from "typescript";

import { StdFile } from "./StdFile";
import { ITypescriptImport, ITypescriptImportModules, TypescriptImport } from "./TypescriptImport";

export class TypescriptFile extends StdFile {
  protected declare imports?: Array<TypescriptImport>;
  protected declare declarations?: Array<string>;
  protected declare defaultDeclaration?: string | null;

  setImports(
    importsToAdd: Array<ITypescriptImport> = [],
    importsToRemove: Array<ITypescriptImport> = []
  ): this {
    const importToAddItems = importsToAdd.map(
      (importItem) => new TypescriptImport(importItem.packageName, importItem.modules)
    );
    const importToRemoveItems = importsToRemove.map(
      (importItem) => new TypescriptImport(importItem.packageName, importItem.modules)
    );

    this.addImports(importToAddItems);
    this.removeImports(importToRemoveItems);
    return this;
  }

  getContent(): string {
    let importLines: string[] = [];
    if (this.imports) {
      this.imports.sort(this.sortImports);
      importLines = this.imports
        .map((importItem) => importItem.toString())
        .filter((line) => !!line.length);
    }

    return [importLines.join("\n"), (this.declarations || []).join("\n")]
      .map((value) => value.trim())
      .join("\n\n")
      .trim();
  }

  protected parseContent(content: string): string {
    this.imports = [];
    this.declarations = [];
    this.defaultDeclaration = null;

    content = super.parseContent(content);
    const body = this.parseTypescriptContent(content);

    for (const bodyItem of body) {
      switch (bodyItem.kind) {
        case SyntaxKind.ImportDeclaration:
          this.parseImportDeclaration(bodyItem as ImportDeclaration);
          break;
        default:
          this.declarations.push(content.substring(bodyItem.pos, bodyItem.end));
      }
    }

    try {
      return this.getContent();
    } catch (error) {
      throw new Error('An error occurred while parsing content "' + content + '", ' + error);
    }
  }

  protected parseTypescriptContent(content: string): NodeArray<Statement> {
    const sourceFile = createSourceFile(this.file ?? "tmp-file.ts", content, ScriptTarget.ES2020);
    return sourceFile.statements;
  }

  protected parseImportDeclaration(bodyItem: ImportDeclaration): void {
    const packageName = bodyItem.moduleSpecifier["text"];
    // File import. I.e: import './index.scss';
    if (!bodyItem.importClause) {
      this.addImports([
        new TypescriptImport(packageName, {
          [TypescriptImport.defaultImport]: TypescriptImport.defaultImport,
        }),
      ]);
      return;
    }

    const namedBindings = bodyItem.importClause.namedBindings;

    // Named imports. I.e: import React from 'react';
    if (bodyItem.importClause.name) {
      const name = bodyItem.importClause.name.escapedText.toString();

      this.addImports([
        new TypescriptImport(packageName, {
          [name]: TypescriptImport.defaultImport,
        }),
      ]);
    }

    if (!namedBindings) {
      return;
    }

    switch (namedBindings.kind) {
      // Namespace imports. I.e: import * as serviceWorker from './serviceWorker';
      case SyntaxKind.NamespaceImport:
        this.addImports([
          new TypescriptImport(packageName, {
            [TypescriptImport.globImport]: namedBindings.name.text,
          }),
        ]);
        break;

      // Named imports. I.e: import { IAppProps } from '@reactionable/core';
      case SyntaxKind.NamedImports:
        // eslint-disable-next-line no-case-declarations
        const modules: ITypescriptImportModules = {};
        for (const element of namedBindings.elements) {
          const propertyName = element?.propertyName?.text;
          const elementName = element.name.escapedText.toString();
          const moduleName: string = propertyName ?? elementName;
          modules[moduleName] = propertyName ? elementName : "";
        }
        this.addImports([new TypescriptImport(packageName, modules)]);
        break;
    }
  }

  protected addImports(imports: TypescriptImport[]): void {
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

  protected removeImports(imports: TypescriptImport[]): void {
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

  protected sortImports(importA: TypescriptImport, importB: TypescriptImport): number {
    // Put local import after
    const importAIsLocal = importA.isLocal();
    const importBIsLocal = importB.isLocal();
    if (importAIsLocal && !importBIsLocal) {
      return 1;
    } else if (!importAIsLocal && importBIsLocal) {
      return -1;
    }

    // Put default import after
    const importAIsDefault = importA.isDefaultImport();
    const importBIsDefault = importB.isDefaultImport();
    if (importAIsDefault && !importBIsDefault) {
      return 1;
    } else if (!importAIsDefault && importBIsDefault) {
      return -1;
    }

    return importA.packageName.localeCompare(importB.packageName);
  }
}
