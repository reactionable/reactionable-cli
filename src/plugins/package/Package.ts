import { resolve } from 'path';
import { which } from 'shelljs';
import { all } from 'deepmerge';
import { exec, info, success } from '../Cli';
import { fileExistsSync, dirExistsSync } from '../File';
import { FileFactory } from '../file/FileFactory';
import { JsonFile } from '../file/JsonFile';

enum PackageManager {
    yarn,
    npm,
};

export const getPackageManager = (dirPath: string): PackageManager => {
    if (!dirExistsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    if (fileExistsSync(resolve(dirPath, 'yarn.lock'))) {
        return PackageManager.yarn;
    }
    return PackageManager.npm;
};

export const installPackages = async (
    dirPath: string,
    packages: string[] = [],
    verbose: boolean = true,
    dev: boolean = false,
): Promise<string[]> => {
    // Remove already installed packges
    packages = packages.filter(packageName => !hasInstalledPackage(dirPath, packageName, dev));
    if (!packages.length) {
        return packages;
    }

    verbose && info(`Installing ${packages.join(', ')}...`);

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

    await exec(command, dirPath);

    verbose && success(packages.length ? 'Package(s) "' + packages.join(', ') + '" have been installed' : 'no package has been installed');
    return packages;
};

export const installDevPackages = (
    dirPath: string,
    devPackages: string[] = [],
    verbose: boolean = true,
): Promise<string[]> => {
    return installPackages(dirPath, devPackages, verbose, true);
};

export const updatePackageJson = async (dirPath: string, data: Object): Promise<void> => {
    const packageJsonPath = getPackageJsonPath(dirPath);
    if (!packageJsonPath) {
        throw new Error('package.json does not exist in directory "' + dirPath + '"');
    }

    await FileFactory.fromFile<JsonFile>(packageJsonPath).appendData(data).saveFile();
    return;
};

export const getPackageJsonPath = (dirPath: string): string | null => {
    if (!dirExistsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }
    const packageJsonPath = resolve(dirPath, 'package.json');

    if (fileExistsSync(packageJsonPath)) {
        return packageJsonPath;
    }
    return null;
};

export const hasPackageJsonConfig = (dirPath: string, data: Object): boolean => {
    const compareObject = (data: Object, packageInfo: Object) => {
        for (const key of Object.keys(data)) {
            if (!packageInfo[key]) {
                return false;
            }
            const typeofData = typeof data[key];
            const typeofPackageInfo = typeof packageInfo[key];
            if (typeofData !== typeofPackageInfo) {
                return false;
            }
            switch (typeofData) {
                case 'object':
                    if (Array.isArray(data[key])) {
                        if (!Array.isArray(packageInfo[key])) {
                            return false;
                        }

                        if (!data[key].every(item => packageInfo[key].contains(item))) {
                            return false;
                        }

                    } else {
                        if (Array.isArray(packageInfo[key])) {
                            return false;
                        }
                        if (!compareObject(data[key], packageInfo[key])) {
                            return false;
                        }
                    }
                    break;
                default:
                    if (data[key] !== packageInfo[key]) {
                        return false;
                    }
            }
        }
        return true;
    }

    return compareObject(data, getPackageInfo(dirPath));
}

export const getPackageInfo = (dirPath: string, property?: string, encoding = 'utf8') => {
    const packageJsonPath = getPackageJsonPath(dirPath);

    if (!packageJsonPath) {
        throw new Error('package.json does not exist in directory "' + dirPath + '"');
    }

    return FileFactory.fromFile<JsonFile>(packageJsonPath).getData(property);
};

export const hasInstalledPackage = (
    dirPath: string,
    packageName: string,
    dev: boolean = false,
    encoding = 'utf8'
): boolean => {
    const installedPackages = getPackageInfo(
        dirPath,
        dev ? 'devDependencies' : 'dependencies',
        encoding
    );

    return !!(installedPackages && installedPackages[packageName]);
};