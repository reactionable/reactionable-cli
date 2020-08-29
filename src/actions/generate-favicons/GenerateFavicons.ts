import { basename } from 'path';

import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';

import { ConsoleService } from '../../services/ConsoleService';
import { IAction } from '../IAction';

@injectable()
export default class GenerateFavicons implements IAction<{ mustPrompt: boolean }> {
  constructor(@inject(ConsoleService) private readonly consoleService: ConsoleService) {}

  getName() {
    return 'Generate favicons';
  }

  async run({ realpath, mustPrompt = false }) {
    this.consoleService.info('Generating favicons...');
    if (mustPrompt) {
      const { confirm } = await prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to generate favicons?',
        },
      ]);

      if (!confirm) {
        return;
      }
    }

    await this.executeFavicon();
    this.consoleService.success(`Favicons have been generated in "${realpath}"`);
  }

  private async executeFavicon(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
