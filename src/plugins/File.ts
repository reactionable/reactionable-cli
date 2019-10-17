import { existsSync, appendFileSync, writeFileSync, readFileSync } from 'fs';
import { mv, sed } from 'shelljs';
import { extname, basename, dirname, resolve } from 'path';

export const replaceInFile = (file: string, search, replacement: string, encoding = 'utf8') => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }
    sed('-i', search, replacement, file);
}

export const replaceFileExtension = (filePath: string, newExtension: string, mustExist = false) => {
    if (!existsSync(filePath)) {
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
}



export const addInFile = (file: string, content: string, onlyIfNotExists = true, encoding = 'utf8') => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }

    if (onlyIfNotExists) {
        const data = readFileSync(file, encoding);
        if (data.indexOf(content) !== -1) {
            return;
        }
    }

    appendFileSync(file, content, encoding);
}