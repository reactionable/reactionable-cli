import { safeWriteFile, getFileContent, FileContentType } from '../File';
import { TypescriptImport, ITypescriptImport } from './TypescriptImport';

export const parseFileTypescriptImports = async (
    file: string,
    encoding = 'utf8'
): Promise<{
    typescriptImports: Array<TypescriptImport>;
    firstImportLine: number;
    otherLines: string[];
}> => {

    const typescriptImports: Array<TypescriptImport> = [];
    const lines = getFileContent(file, encoding, FileContentType.lines);
    const otherLines: string[] = [];

    let lineNumber = 0;
    let firstImportLine: number | undefined = 0;
    for (const line of lines) {
        const typescriptImport = TypescriptImport.fromString(line);
        if (typescriptImport) {
            if (firstImportLine === undefined) {
                firstImportLine = lineNumber;
            }
            typescriptImports.push(typescriptImport);
        }
        else {
            otherLines.push(line);
        }
        lineNumber++;
    }

    return { typescriptImports, firstImportLine, otherLines };
};

export const setTypescriptImports = async (
    file: string,
    importsToAdd: Array<ITypescriptImport> = [],
    importsToRemove: Array<ITypescriptImport> = [],
    encoding = 'utf8'
) => {
    const importToAddItems = importsToAdd.map(importItem => new TypescriptImport(
        importItem.packageName,
        importItem.modules
    ));
    const importToRemoveItems = importsToRemove.map(importItem => new TypescriptImport(
        importItem.packageName,
        importItem.modules
    ));

    const { typescriptImports, firstImportLine, otherLines } = await parseFileTypescriptImports(file, encoding);
    let importsMayHaveChanged = false;

    // Add imports
    for (const importItem of importToAddItems) {
        let importToAddFound = false;
        for (const typescriptImport of typescriptImports) {
            if (importItem.packageName !== typescriptImport.packageName) {
                continue;
            }
            typescriptImport.addModules(importItem.modules);
            importsMayHaveChanged = true;
            importToAddFound = true;
        }
        if (!importToAddFound) {
            typescriptImports.push(importItem);
            importsMayHaveChanged = true;
        }
    }

    // Remove imports    
    for (const importItem of importToRemoveItems) {
        for (const typescriptImport of typescriptImports) {
            if (importItem.packageName !== typescriptImport.packageName) {
                continue;
            }
            typescriptImport.removeModules(importItem.modules);
            importsMayHaveChanged = true;
        }
    }

    typescriptImports.map(typescriptImport => {
        for (const importItem of importToRemoveItems) {
            if (importItem.packageName !== typescriptImport.packageName) {
                continue;
            }
            typescriptImport.removeModules(importItem.modules);
            importsMayHaveChanged = true;
        }
        return typescriptImport;
    });

    if (importsMayHaveChanged) {
        const importLines = typescriptImports.map(importItem => importItem.toString()).filter(line => !!line.length);
        importLines.sort();
        otherLines.splice(firstImportLine || 0, 0, ...importLines);
        await safeWriteFile(file, otherLines, encoding);
    }
}
