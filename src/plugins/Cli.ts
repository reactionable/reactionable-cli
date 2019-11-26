import { red, green, yellow, bgGreen, bgRed, grey } from 'chalk';
import { spawn } from 'child_process';
import { which } from 'shelljs';
import { prompt } from 'inquirer';
import { Change } from 'diff';
import { dirExistsSync } from './File';


let runStartDate: Date | undefined = undefined;
export const getRunStartDate = (): Date | undefined => {
    return runStartDate;
}

export const initRunStartDate = () => {
    runStartDate = new Date();
}

export const getCmd = (cmd: string): string | null => {
    if (which(cmd)) {
        return cmd;
    }
    return null;
}

export const getNpmCmd = (cmd: string): string | null => {
    if (getCmd(cmd)) {
        return cmd;
    }
    if (getCmd('npx')) {
        return 'npx ' + cmd;
    }
    return null;
}

export const getNodeVersion = (): string => {
    const nodeVersionMatch = process.version.match(/^v(\d+\.\d+)/);

    if (!nodeVersionMatch) {
        throw new Error('Unable to retrieve node version');
    }
    return nodeVersionMatch[1];
}

export const exec = (
    cmd: string,
    cwd: string,
    silent: boolean = false,
): Promise<string> => {
    if (cwd && !dirExistsSync(cwd)) {
        throw new Error('Directory "' + cwd + '" does not exist');
    }
    return new Promise((resolve, reject) => {

        const child = spawn(cmd, {
            stdio: silent ? 'pipe' : 'inherit',
            shell: true,
            cwd,
        });

        let output = '';
        let error = '';

        child.on('exit', function (code, signal) {
            if (code) {
                return reject(error);
            }
            resolve(output);
        });

        if (child.stdout) {
            child.stdout.on('data', (data) => {
                output += `\n${data}`;
            });
        }
        if (child.stderr) {
            child.stderr.on('data', (data) => {
                error += `\n${data}`;
            });
        }
    })
}

export const info = (message: string) => {
    process.stdout.write("\n" + yellow('→ ') + message + "\n");
}

export const success = (message: string) => {
    process.stdout.write(green('✓ ') + message + "\n");
}

export const error = (error: Error | string) => {
    if ('string' === typeof error) {
        process.stderr.write("\n" + red(`⚠ ${error}`) + "\n");
        return;
    }
    process.stderr.write("\n" + red(`⚠ [${error.name}] ${error.message}`) + "\n" + error.stack + "\n");
}

export const promptOverwriteFileDiff = async (file: string, diff: Change[]): Promise<boolean> => {
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

export const pause = (message = `Press any key to continue...`) => {
    return new Promise((resolve, reject) => {
        try {
            info(message + "\n");
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', resolve);
        } catch (error) {
            reject(error);
        }
    })

}