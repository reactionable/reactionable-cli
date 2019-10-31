import { existsSync, readFileSync } from "fs";
import { getFileContentEOL, safeWriteFile } from "./File";

export interface ITypescriptImport {
    packageName: string,
    modules: ITypescriptImportModules,
};

export const addTypescriptImports = async (
    file: string,
    imports: Array<ITypescriptImport>,
    encoding = 'utf8'
) => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }

    const fileContent = readFileSync(file).toString();
    const eol = getFileContentEOL(fileContent);
    const importItems = imports.map(importItem => new TypescriptImport(
        importItem.packageName,
        importItem.modules
    ));

    const lines = fileContent.split(eol);
    let firstImportLine: number | undefined;
    const fileLines: string[] = [];

    let importsHaveChanged = false;
    for (const line of lines) {

        const typescriptImport = TypescriptImport.fromString(line);
        if (!typescriptImport) {
            fileLines.push(line);
            continue;
        }

        // Add typescript import to existing import items
        let foundImport = false;
        for (const importItem of importItems) {
            if (importItem.packageName !== typescriptImport.packageName) {
                continue;
            }

            const previousModules = importsHaveChanged ? null : JSON.stringify(typescriptImport.modules);
            importItem.addModules(typescriptImport.modules);
            if (!importsHaveChanged && JSON.stringify(typescriptImport.modules) !== previousModules) {
                importsHaveChanged = true;
            }
        }
        if (!foundImport) {
            importItems.push(typescriptImport);
            importsHaveChanged = true;
        }
    }

    if (importsHaveChanged) {
        const importLines = importItems.map(importItem => importItem.toString());
        importLines.sort();

        fileLines.splice(firstImportLine || 0, 0, ...importLines);
        await safeWriteFile(file, fileLines.join(eol), encoding);
    }
}

type ITypescriptImportModules = { [key: string]: string };

class TypescriptImport {

    static readonly defaultImport = 'default';

    constructor(
        public packageName: string,
        public modules: ITypescriptImportModules
    ) { }

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

    private static parseImportModule(importModule: string, defaultAs: string = ''): ITypescriptImportModules {
        const parsedPodules: ITypescriptImportModules = {};
        for (const modulePart of importModule.trim().split(',')) {
            if (!modulePart.length) {
                continue;
            }
            const moduleParts = modulePart.trim().split('as');

            parsedPodules[moduleParts[0].trim()] = moduleParts.length === 1
                ? defaultAs
                : moduleParts[1].trim();
        }
        return parsedPodules;
    }

    addModules(modules: ITypescriptImportModules) {
        this.modules = Object.assign(this.modules, modules);
    }

    toString() {
        let defaultImport: string = '';
        const brakesImports: string[] = [];

        for (const moduleName of Object.keys(this.modules)) {
            if (this.modules[moduleName] === TypescriptImport.defaultImport) {
                if (defaultImport.length) {
                    throw new Error(`Unable to have many imports for package "${this.packageName}": "${defaultImport}, ${moduleName}"`);
                }
                defaultImport = moduleName;
                continue;
            }

            let brakesImport = moduleName;
            if (this.modules[moduleName].length) {
                brakesImport += ' as ' + this.modules[moduleName];
            }
            brakesImports.push(brakesImport);
        }

        let imports = defaultImport;
        if (brakesImports.length) {
            imports += (imports.length ? ', ' : '') + '{ ' + brakesImports.join(', ') + ' }';
        }
        return `import ${imports} from '${this.packageName}';`;
    }
}
