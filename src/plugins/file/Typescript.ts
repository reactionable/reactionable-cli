import { TypescriptImport, ITypescriptImport } from './TypescriptImport';
import { TypescriptFile } from './TypescriptFile';
import { FileFactory } from './FileFactory';

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

    const typescriptFile = FileFactory.fromFile(file, encoding) as TypescriptFile;
    typescriptFile.addImports(importToAddItems);
    typescriptFile.removeImports(importToRemoveItems);
    typescriptFile.saveFile();
}
