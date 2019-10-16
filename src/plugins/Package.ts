import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { which } from 'shelljs';
import { exec } from './Cli';

enum PackageManager {
    yarn,
    npm,
}

export const getPackageManager = (dirPath: string): PackageManager => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    if (existsSync(resolve(dirPath, 'yarn.lock'))) {
        return PackageManager.yarn;
    }
    return PackageManager.npm;
}

export const installPackages = (
    dirPath: string,
    packages: string[] = [],
    dev: boolean = false
) => {
    if (!packages.length) {
        return;
    }

    // Retrieve package manager
    const packageManager = getPackageManager(dirPath);
    
    // Prepare install command
    let command;
    switch (packageManager) {
        case PackageManager.yarn:
            if (!which('yarn')) {
                throw new Error('Unable to install packages, please install "yarn"');
            }
            command = 'yarn add ' + packages.join(' ') + (dev ? ' --dev ' : '');

        case PackageManager.npm:
            if (!which('npm')) {
                throw new Error('Unable to install packages, please install "npm"');
            }
            command = 'npm install ' + (dev ? ' -D ' : '') + packages.join(' ') + ' --save';
    }

    exec(command, dirPath);
}

export const installDevPackages = (
    dirPath: string,
    devPackages: string[] = []
) => {
    installPackages(dirPath, devPackages, true);
}

export const getPackageInfo = (dirPath: string, property: string, encoding = 'utf8') => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    const packageJsonPath = resolve(dirPath, 'package.json');

    if (!existsSync(packageJsonPath)) {
        throw new Error('package.json "' + packageJsonPath + '" does not exist');
    }

    const data = JSON.parse(readFileSync(packageJsonPath, encoding));

    return data[property];
}