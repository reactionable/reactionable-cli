import chalk from 'chalk';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { which } from 'shelljs';

export const getCmd = (cmd: string): string | null => {
    if (which(cmd)) {
        return cmd;
    }
    if (which('npx')) {
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
    cwd?: string,
): Promise<string> => {
    if (cwd && !existsSync(cwd)) {
        throw new Error('Directory "' + cwd + '" does not exist');
    }
    return new Promise((resolve, reject) => {

        const child = spawn(cmd, {
            stdio: 'inherit',
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
    process.stdout.write("\n" + chalk.yellow('→ ') + message + "\n");
}

export const success = (message: string) => {
    process.stdout.write(chalk.green('✓ ') + message + "\n");
}

export const error = (error: Error | string) => {
    if ('string' === typeof error) {
        process.stderr.write("\n" + chalk.red(`⚠ ${error}`) + "\n");
        return;
    }
    process.stderr.write("\n" + chalk.red(`⚠ [${error.name}] ${error.message}`) + "\n" + error.stack + "\n");
}

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