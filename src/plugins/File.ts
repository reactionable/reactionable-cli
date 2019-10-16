import { existsSync, appendFileSync, writeFileSync, readFileSync } from 'fs';
import { render } from 'mustache';
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

export const createFileFromTemplate = (filePath: string, template: string, view: Object, encoding = 'utf8') => {
    const parentDir = dirname(filePath);
    if (!existsSync(parentDir)) {
        throw new Error('Unable to create file "' + filePath + '", directory "' + parentDir + '" does not exist');
    }

    writeFileSync(
        filePath,
        render(template, view),
        encoding
    );
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