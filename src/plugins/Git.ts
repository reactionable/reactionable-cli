import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { which } from 'shelljs';
import { parse } from 'js-ini';
import { exec } from './Cli';

export const initializedGit = async (dirPath: string) => {    
    const filepath = resolve(dirPath, '.git/HEAD');
    if (existsSync(filepath)) {
        return;
    }
    await exec(getGitCmd() + ' init', dirPath);
}

export const getGitCurrentBranch = (dirPath: string, defaultBranch: string): string => {
    const filepath = resolve(dirPath, '.git/HEAD');
    if (!existsSync(filepath)) {
        throw new Error('File "' + filepath + '" does not exist');
    }
    const match = /ref: refs\/heads\/([^\n]+)/.exec(readFileSync(filepath).toString());
    return match ? match[1] : defaultBranch;
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
    return config['remote "origin"'] && config['remote "origin"'].url;
}

export const getGitCmd = (): string | null => {
    if (which('git')) {
        return 'git';
    }
    return null;
}

