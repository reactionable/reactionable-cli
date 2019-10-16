import chalk from 'chalk';
import { Spinner } from 'cli-spinner';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

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

export const error = (message: string) => {
    process.stderr.write("\n" + chalk.red('⚠ ' + message) + "\n");
}

export const spin = (title: string): Spinner => {
    const spinner = new Spinner(title + ' %s');
    spinner.setSpinnerString('◐◓◑◒');
    spinner.start();
    return spinner;
}