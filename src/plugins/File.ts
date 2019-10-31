import { EOL } from 'os';
import { existsSync, appendFileSync, readFileSync, writeFileSync } from 'fs';
import { mv, sed } from 'shelljs';
import { extname, basename, dirname, resolve } from 'path';
import { prompt } from 'inquirer';
import * as JsDiff from 'diff';
import chalk from 'chalk';
import { info } from 'console';
import { pause } from './Cli';

export const replaceInFile = (file: string, search, replacement: string, encoding = 'utf8') => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }
    sed(
        '-i',
        search,
        replacement.replace("\n", getFileContentEOL(file)),
        file
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
}

export const addInFile = async (file: string, content: string, after?: string, onlyIfNotExists = true, encoding = 'utf8') => {
    if (!existsSync(file)) {
        throw new Error('File "' + file + '" does not exist');
    }

    const fileContent = readFileSync(file).toString();
    if (onlyIfNotExists) {
        const data = readFileSync(file, encoding);
        if (data.indexOf(content) !== -1) {
            return;
        }
    }
    if (after) {
        const contentLines = content.split("\n");

        const eol = getFileContentEOL(fileContent);
        const lines = fileContent.split(eol);

        let lineNumber = 0;
        for (const line of lines) {
            // Write content after found line 
            if (line === after) {
                lines.splice(lineNumber + 1, 0, ...contentLines);
                await safeWriteFile(file, lines.join(eol), encoding);
                return;
            }
            lineNumber++;
        }
    }

    appendFileSync(
        file,
        content.replace("\n", getFileContentEOL(file)),
        encoding
    );
    return;
}

export const getFileContentEOL = (content: string): string => {
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

export const safeWriteFile = async (file: string, content: string, encoding = 'utf8') => {
    // Set current OS EOL to content
    const contentEol = getFileContentEOL(content);
    if (EOL !== contentEol) {
        content = content.replace(contentEol, EOL);
    }

    if (!existsSync(file)) {
        writeFileSync(file, content, encoding);
        return;
    }

    let fileContent = readFileSync(file, encoding);
    const fileEol = getFileContentEOL(file);
    if (EOL !== fileEol) {
        fileContent = fileContent.replace(fileContent, EOL);
    }


    const diff = JsDiff.diffChars(fileContent, content);

    let hasDiff = diff.some(part => part.added || part.removed);
    if (!hasDiff) {
        return;
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
            return;
        }

        if (action === 'overwrite') {
            break;
        }

        // Compare diff
        process.stderr.write("\n\n");
        info(`File ${file} diff:`);
        process.stderr.write("\n-----------------------------------------------\n");
        for (const part of diff) {
            // green for additions, red for deletions
            // grey for common parts
            const isSpaces = part.value.match(/^\s+$/);
            let data = part.value;
            switch (true) {
                case !!part.added:
                    data = isSpaces ? chalk.bgGreen(data) : chalk.green(data);
                    break;
                case !!part.removed:
                    data = isSpaces ? chalk.bgRed(data) : chalk.red(data);
                    break;
                default:
                    data = chalk.grey(data);
                    break;
            }
            process.stderr.write(data);
        };
        process.stderr.write("\n-----------------------------------------------\n\n");
        await pause();
    }
    writeFileSync(file, content, encoding);
}