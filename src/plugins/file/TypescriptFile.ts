import { parse } from '@typescript-eslint/typescript-estree';
import { TypescriptImport } from './TypescriptImport';
import { StdFile } from './StdFile';
import { EOL } from 'os';

export class TypescriptFile extends StdFile {

    protected imports: Array<TypescriptImport>;
    protected declarations: Array<string>;
    protected defaultDeclaration: string | null;

    constructor(
        file: string | null = null,
        encoding: string = 'utf8',
        content: string = '',
    ) {
        super(file, encoding, content);
        this.imports = [];
        this.declarations = [];
        this.defaultDeclaration = null;
        this.parseContent();
    }

    protected parseContent(): void {
        try {
            const { body } = parse(this.content, {
                jsx: true,
            });
            for (const bodyItem of body) {
                switch (bodyItem.type) {
                    case 'ImportDeclaration':
                        for (const specifier of bodyItem.specifiers) {
                            this.addImports([new TypescriptImport(
                                bodyItem.source.value as string,
                                {
                                    [specifier.local.name]: specifier.type === 'ImportDefaultSpecifier' ? 'default' : '',
                                }
                            )]);
                        };
                        break;
                    default:
                        this.declarations.push(this.content.substr(bodyItem.range[0], bodyItem.range[1] - bodyItem.range[0]));
                }
            }
        }
        catch (error) {

            let content = this.content;
            if(error.lineNumber){
                content = content.split("\n")[error.lineNumber-1];
            }

            throw new Error(`An error occurred while parsing file content "${this.file}": ${JSON.stringify(error)} => "${content.trim()}"`);
        }
    }

    getContent(): string {
        this.imports.sort((importA, importB) => {
            if (/^\./.exec(importA.packageName)) {
                return 1;
            }
            if (/^\./.exec(importB.packageName)) {
                return -1;
            }
            return importA.packageName.localeCompare(importB.packageName);
        });
        const importLines = this.imports.map(importItem => importItem.toString()).filter(line => !!line.length);
        return [...importLines, '', ...this.declarations].join(EOL);
    }

    addImports(imports: TypescriptImport[]) {
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

    removeImports(imports: TypescriptImport[]) {
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