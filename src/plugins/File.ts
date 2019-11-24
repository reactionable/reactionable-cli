import { EOL } from 'os';
import { existsSync, readFileSync, writeFileSync, statSync, realpathSync } from 'fs';
import { mv } from 'shelljs';
import { extname, basename, dirname, resolve } from 'path';
import { prompt } from 'inquirer';
import { diffLines, Change, diffJson, diffChars } from 'diff';
import { bgGreen, bgRed, grey, red, green } from 'chalk';
import { info } from 'console';
import { pause } from './Cli';

export const safeReplaceFile = (file: string, search: RegExp, replacement: string, encoding = 'utf8'): Promise<void> => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }

    const content = getFileContent(file, encoding);
    return safeWriteFile(
        file,
        content.replace(search, replacement),
        encoding
    );
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
};

export const safeWriteFile = async (file: string, content: string | string[], encoding = 'utf8') => {
    // Set current OS EOL to content
    if ('string' === typeof content) {
        content = fixContentEOL(content);
    }
    else {
        content = content.join(EOL);
    }

    if (!existsSync(file)) {
        writeFileSync(file, content, encoding);
        return;
    }

    let fileContent = getFileContent(file, encoding);
    const diff = diffChars(fileContent, content);
    const overwrite = await promptOverwriteFileDiff(file, diff);

    if (overwrite) {
        writeFileSync(file, content, encoding);
    }
};

export const safeWriteJsonFile = async (file: string, data: Object, encoding = 'utf8') => {
    const fileData = getFileContent(file, encoding, FileContentType.data);
    const diff = diffJson(fileData, data);
    const overwrite = await promptOverwriteFileDiff(file, diff);

    if (overwrite) {
        writeFileSync(file, JSON.stringify(data, null, '  '), encoding);
    }
};

export const safeAppendFile = async (file: string, content: string, after?: string, onlyIfNotExists = true, encoding = 'utf8') => {
    content = fixContentEOL(content);
    const fileContent = getFileContent(file, encoding);
    if (onlyIfNotExists) {
        if (fileContent.indexOf(content) !== -1) {
            return;
        }
    }

    if (!after) {
        await safeWriteFile(file, fileContent + EOL + content, encoding);
        return;
    }

    const contentLines = content.split(EOL);
    const lines = getFileContent(file, encoding, FileContentType.lines);

    let lineNumber = 0;
    for (const line of lines) {
        // Write content after found line 
        if (line === after) {
            lines.splice(lineNumber + 1, 0, ...contentLines);
            await safeWriteFile(file, lines, encoding);
            return;
        }
        lineNumber++;
    }
};


export enum FileContentType {
    mtime,
    content,
    lines,
    data,
}

const fileContentCache: {
    [key: string]: {
        [FileContentType.mtime]: Date;
        [FileContentType.content]: string;
        [FileContentType.lines]: string[] | undefined;
        [FileContentType.data]: Object | undefined;
    }
} = {};

export function getFileContent(file: string, encoding: string, type: FileContentType.data): Object;
export function getFileContent(file: string, encoding: string, type: FileContentType.mtime): Date;
export function getFileContent(file: string, encoding: string, type: FileContentType.lines): string[];
export function getFileContent(file: string, encoding: string): string;
export function getFileContent(file: string, encoding: string = 'utf8', type: FileContentType = FileContentType.content): string[] | string | Date | Object {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }
    file = realpathSync(file);
    const mtime = statSync(file).mtime;

    if (
        !fileContentCache[file]
        || !mtime
        || fileContentCache[file][FileContentType.mtime] < mtime
    ) {
        let fileContent = readFileSync(
            file,
            encoding
        ).toString();
        fileContent = fixContentEOL(fileContent);

        fileContentCache[file] = {
            [FileContentType.mtime]: mtime,
            [FileContentType.content]: fileContent,
            [FileContentType.lines]: undefined,
            [FileContentType.data]: undefined,
        };
    }

    const typeData = fileContentCache[file][type];
    if (typeData !== undefined) {
        return typeData;
    }

    const content = fileContentCache[file][FileContentType.content];

    switch (type) {
        case FileContentType.data:
            switch (extname(file)) {
                case '.json':
                    return fileContentCache[file][type] = JSON.parse(content);
                default:
                    throw new Error('Unable to parse file "' + file + '"');
            }
        case FileContentType.lines:
            return fileContentCache[file][type] = content.split(EOL);
        default:
            throw new Error('Unsuported file content type');
    }
}


export const fixContentEOL = (content: string): string => {
    return content.replace(/(?:\r\n|\r|\n)/g, EOL);
}

export const getContentEOL = (content: string): string => {
    const m = content.match(/\r\n|\n/g);
    if (!m) {
        return EOL; // use the OS default
    }
    const u = m && m.filter(a => a === '\n').length;

    const w = m && m.length - u;
    if (u === w) {
        return EOL; // use the OS default
    }
    return u > w ? '\n' : '\r\n';
}

const promptOverwriteFileDiff = async (file: string, diff: Change[]): Promise<boolean> => {
    let hasDiff = diff.some(part => part.added || part.removed);
    if (!hasDiff) {
        return false;
    }

    while (true) {
        const { action } = await prompt([
            {
                type: 'list',
                name: 'action',
                message: 'File "' + file + '" exists already, what do you want to do?',
                choices: [
                    { 'name': 'Show diff', 'value': 'diff' },
                    { 'name': 'Overwrite file', 'value': 'overwrite' },
                    { 'name': 'Keep original file', 'value': 'cancel' },

                ]
            },
        ]);

        if (action === 'cancel') {
            return false;
        }

        if (action === 'overwrite') {
            return true;
        }

        // Compare diff
        process.stderr.write("\n\n");
        info(`File ${file} diff:`);
        process.stderr.write("\n-----------------------------------------------\n");
        for (const part of diff) {
            // green for additions, red for deletions
            // grey for common parts
            const isSpaces = part.value.match(/^[\r\n\s]+$/);
            let data = part.value;
            switch (true) {
                case !!part.added:
                    data = isSpaces ? bgGreen(data) : green(data);
                    break;
                case !!part.removed:
                    data = isSpaces ? bgRed(data) : red(data);
                    break;
                default:
                    data = grey(data);
                    break;
            }
            process.stderr.write(data);
        };
        process.stderr.write("\n-----------------------------------------------\n\n");
        await pause();
    }
};