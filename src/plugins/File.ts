import { existsSync, lstatSync } from 'fs';
import { mv } from 'shelljs';
import { extname, basename, dirname, resolve } from 'path';

export const fileExistsSync = (path: string) => {
    if (!existsSync(path)) {
        return false
    }
    return lstatSync(path).isFile();
};

export const dirExistsSync = (path: string) => {
    if (!existsSync(path)) {
        return false
    }
    return lstatSync(path).isDirectory();
};

export const replaceFileExtension = (filePath: string, newExtension: string, mustExist = false) => {
    if (!fileExistsSync(filePath)) {
        if (mustExist) {
            throw new Error('File "' + filePath + '" does not exist');
        }
        return;
    }

    const newFilePath = resolve(
        dirname(filePath),
        basename(
            filePath,
            extname(filePath)
        ) + '.' + newExtension.replace(/^[\s\.]+/, '')
    );
    mv(filePath, newFilePath);
};