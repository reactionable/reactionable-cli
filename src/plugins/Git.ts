import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { parse, IIniObjectSection } from 'js-ini';

const hasGit = (dirPath: string) => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }
    return existsSync(resolve(dirPath, '.git'));
}

export const getGitCurrentBranch = (dirPath: string): string | null => {
    const filepath = resolve(dirPath, '.git/HEAD');
    if (!existsSync(filepath)) {
        throw new Error('File "' + filepath + '" does not exist');
    }
    const match = /ref: refs\/heads\/([^\n]+)/.exec(readFileSync(filepath).toString());
    return match ? match[1] : null;
}

export const getGitConfig = (dirPath: string) => {
    const filepath = resolve(dirPath, '.git/config');
    if (!existsSync(filepath)) {
        throw new Error('File "' + filepath + '" does not exist');
    }
    return parse(readFileSync(filepath, 'utf-8'));
}

export const getGitRemoteOriginUrl = (dirPath: string) => {
    const config = getGitConfig(dirPath) as any;
    return config.remote && config.remote.origin && config.remote.origin.url;
}

