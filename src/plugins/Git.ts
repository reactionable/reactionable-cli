import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as parseGitRemote from 'parse-github-url';
import { which } from 'shelljs';
import { parse } from 'js-ini';
import { exec, info, success } from './Cli';
import { Result } from 'parse-github-url';
import { fileExistsSync } from './File';

export const initializedGit = async (dirPath: string) => {
    const filepath = resolve(dirPath, '.git/HEAD');
    if (fileExistsSync(filepath)) {
        return;
    }
    info('Initilize Git...');
    await exec(getGitCmd() + ' init', dirPath);
    success('Git has been initialized in "' + dirPath + '"');
}

export const getGitCurrentBranch = (dirPath: string, defaultBranch: string): string => {
    const filepath = resolve(dirPath, '.git/HEAD');
    if (!fileExistsSync(filepath)) {
        throw new Error('File "' + filepath + '" does not exist');
    }
    const match = /ref: refs\/heads\/([^\n]+)/.exec(readFileSync(filepath).toString());
    return match ? match[1] : defaultBranch;
}

export const getGitConfig = (dirPath: string) => {
    const filepath = resolve(dirPath, '.git/config');
    if (!fileExistsSync(filepath)) {
        throw new Error('File "' + filepath + '" does not exist');
    }
    return parse(readFileSync(filepath, 'utf-8'));
};

export function getGitRemoteOriginUrl(dirPath: string, parsed: true): Result | null;
export function getGitRemoteOriginUrl(dirPath: string, parsed: false): string | null;
export function getGitRemoteOriginUrl(dirPath: string, parsed: boolean = false): string | Result | null {
    const config = getGitConfig(dirPath) as any;
    const url = config['remote "origin"'] && config['remote "origin"'].url;
    if (!parsed) {
        return url || null;
    }
    if(!url){
        throw new Error('Unable to parse undefined git remote origin url');
    }
    return parseGitRemoteUrl(url);
};

const parsedGitRemoteUrlCache: { [key: string]: Result | null } = {};
export const parseGitRemoteUrl = (remoteUrl: string): Result | null => {
    if (parsedGitRemoteUrlCache[remoteUrl] !== undefined) {
        return parsedGitRemoteUrlCache[remoteUrl];
    }
    return parsedGitRemoteUrlCache[remoteUrl] = parseGitRemote(remoteUrl);
}

export const getGitCmd = (): string | null => {
    if (which('git')) {
        return 'git';
    }
    return null;
}

