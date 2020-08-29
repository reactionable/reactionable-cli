import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';
import { parse } from 'js-ini';
import parseGitRemote from 'parse-github-url';
import { Result } from 'parse-github-url';
import { which } from 'shelljs';

import { CliService } from '../CliService';
import { ConsoleService } from '../ConsoleService';
import { ConventionalCommitsService } from './ConventionalCommitsService';

export type GitConfig = {
  'remote.origin.url': string;
};

@injectable()
export class GitService {
  private readonly parsedGitRemoteUrls: Map<string, Result | null> = new Map();

  constructor(
    @inject(CliService) private readonly cliService: CliService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(ConventionalCommitsService)
    private readonly conventionalCommitsService: ConventionalCommitsService
  ) {}

  execGitCmd(cmd: string | string[], dirPath: string, silent?: boolean): Promise<string> {
    const gitCmd = this.getGitCmd();
    if (!gitCmd) {
      throw new Error('Unable to execute Git command, please install "Git"');
    }
    return this.cliService.execCmd(
      [gitCmd, ...(Array.isArray(cmd) ? cmd : [cmd])],
      dirPath,
      silent
    );
  }

  async isAGitRepository(dirPath: string): Promise<boolean> {
    try {
      const result = await this.execGitCmd('rev-parse --is-inside-work-tree', dirPath, true);
      return result.trim() === 'true';
    } catch (error) {
      if (error.toString().indexOf('not a git repository') !== -1) {
        return false;
      }
      throw error;
    }
  }

  async initializeGit(dirPath: string): Promise<void> {
    if (await this.isAGitRepository(dirPath)) {
      return;
    }
    this.consoleService.info('Initilize Git...');
    await this.execGitCmd('init', dirPath);
    this.consoleService.success(`Git has been initialized in "${dirPath}"`);
  }

  async getGitCurrentBranch(dirPath: string, defaultBranch: string): Promise<string> {
    let branch = await this.execGitCmd('name-rev --name-only HEAD', dirPath, true);
    if (branch) {
      branch = branch.trim();
    }
    return branch || defaultBranch;
  }

  async getGitRemoteOriginUrl(dirPath: string, parsed: true): Promise<Result | null>;
  async getGitRemoteOriginUrl(dirPath: string, parsed: false): Promise<string | null>;
  async getGitRemoteOriginUrl(
    dirPath: string,
    parsed: boolean = false
  ): Promise<string | Result | null> {
    const config = await this.getGitConfig(dirPath);
    const url = config['remote.origin.url'];
    if (!parsed) {
      return url || null;
    }
    if (!url) {
      throw new Error('Unable to parse undefined git remote origin url');
    }
    return this.parseGitRemoteUrl(url);
  }

  parseGitRemoteUrl(remoteUrl: string): Result | null {
    let parsedGitRemoteUrl = this.parsedGitRemoteUrls.get(remoteUrl);
    if (parsedGitRemoteUrl !== undefined) {
      return parsedGitRemoteUrl;
    }

    parsedGitRemoteUrl = parseGitRemote(remoteUrl);
    this.parsedGitRemoteUrls.set(remoteUrl, parsedGitRemoteUrl);

    return parsedGitRemoteUrl;
  }

  async commitFiles(
    realpath: string,
    commitMessage: string,
    commitMessageType: string
  ): Promise<void> {
    // Determine if Git working directory is clean
    const status = await this.execGitCmd(['status', '--porcelain'], realpath, true);
    if (!status) {
      return;
    }

    this.consoleService.info('Commit files...');

    const defaultCommitMessage = await this.getCommitMessage(
      realpath,
      commitMessage,
      commitMessageType
    );

    const answer = await prompt([
      {
        type: 'input',
        name: 'commitMessage',
        default: defaultCommitMessage,
        message: 'Commit message',
      },
    ]);

    commitMessage = answer.commitMessage;
    await this.execGitCmd(['fetch', '--all'], realpath);
    await this.execGitCmd(['add', '.'], realpath);
    await this.execGitCmd(['commit', '-am', `"${commitMessage}"`], realpath);
    this.consoleService.success('Files have been commited');
  }

  async pushCommits(realpath: string) {
    if (!(await this.isAGitRepository(realpath))) {
      return;
    }
    this.consoleService.info('Push commits...');
    return this.execGitCmd(['push', '--all'], realpath);
  }

  private async getCommitMessage(
    realpath: string,
    commitMessage: string,
    commitMessageType: string
  ): Promise<string> {
    const hasConventionalCommits = await this.conventionalCommitsService.hasConventionalCommits(
      realpath
    );

    if (!hasConventionalCommits) {
      return commitMessage.charAt(0).toUpperCase() + commitMessage.slice(1);
    }

    return this.conventionalCommitsService.formatCommitMessage(
      realpath,
      commitMessageType,
      commitMessage
    );
  }

  private getGitCmd(): string | null {
    if (which('git')) {
      return 'git';
    }
    return null;
  }

  private async getGitConfig(dirPath: string): Promise<GitConfig> {
    const config = await this.execGitCmd('config --local --list', dirPath, true);

    return parse(config) as GitConfig;
  }
}
