import { spawn } from 'child_process';

import { bgGreen, bgRed, green, grey, red } from 'chalk';
import { Change } from 'diff';
import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';
import { which } from 'shelljs';

import { ConsoleService } from './ConsoleService';
import { FileService } from './file/FileService';

@injectable()
export class CliService {
  private runStartDate: Date | undefined;

  constructor(
    @inject(FileService) private readonly fileService: FileService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService
  ) {}

  getRunStartDate(): Date | undefined {
    return this.runStartDate;
  }

  initRunStartDate(): Date {
    return (this.runStartDate = new Date());
  }

  getCmd(cmd: string): string | null {
    if (which(cmd)) {
      return cmd;
    }
    return null;
  }

  execCmd(args: string | string[], cwd?: string, silent: boolean = false): Promise<string> {
    if (!args.length) {
      throw new Error('Command args must not be empty');
    }

    if (cwd && !this.fileService.dirExistsSync(cwd)) {
      throw new Error(`Directory "${cwd}" does not exist`);
    }

    let cmd: string;
    if (Array.isArray(args)) {
      cmd = args.shift()!;
    } else {
      cmd = args;
      args = [];
    }

    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args as string[], {
        stdio: silent ? 'pipe' : 'inherit',
        shell: true,
        windowsVerbatimArguments: true,
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
    });
  }

  async promptOverwriteFileDiff(file: string, diff: Change[]): Promise<boolean> {
    const hasDiff = diff.some((part) => part.added || part.removed);
    if (!hasDiff) {
      return false;
    }

    while (true) {
      const { action } = await prompt([
        {
          type: 'list',
          name: 'action',
          message: `File "${file}" exists already, what do you want to do?`,
          choices: [
            { name: 'Show diff', value: 'diff' },
            { name: 'Overwrite file', value: 'overwrite' },
            { name: 'Keep original file', value: 'cancel' },
          ],
        },
      ]);

      if (action === 'cancel') {
        return false;
      }

      if (action === 'overwrite') {
        return true;
      }

      // Compare diff
      let diffMessage = `File ${file} diff:\n-----------------------------------------------\n`;

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
        diffMessage += data;
      }

      diffMessage += '\n-----------------------------------------------\n';

      this.consoleService.info(diffMessage);
      await this.pause();
    }
  }

  getNodeVersion(): string {
    const nodeVersionMatch = process.version.match(/^v(\d+\.\d+)/);

    if (!nodeVersionMatch) {
      throw new Error('Unable to retrieve node version');
    }
    return nodeVersionMatch[1];
  }

  getGlobalCmd(cmd: string): string | null {
    if (this.getCmd(cmd)) {
      return cmd;
    }
    if (this.getCmd('npx')) {
      return `npx ${cmd}`;
    }
    return null;
  }

  async upgradeGlobalPackage(packageName: string) {
    const outdatedInfo = await this.execCmd(
      ['npm', 'outdated', '-g', packageName, '--json', '||', 'true'],
      undefined,
      true
    );

    if (outdatedInfo) {
      const outdatedData = JSON.parse(outdatedInfo);
      if (
        outdatedData[packageName]?.current &&
        outdatedData[packageName].current !== outdatedData[packageName].latest
      ) {
        return this.execCmd(['npm', 'install', '-g', packageName], undefined);
      }
    }
  }

  private pause(message = 'Press any key to continue...') {
    return new Promise((resolve, reject) => {
      try {
        this.consoleService.info(message);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', resolve);
      } catch (error) {
        reject(error);
      }
    });
  }
}
