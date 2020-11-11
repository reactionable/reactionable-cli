import { resolve } from 'path';

import { text } from 'figlet';
import { prompt } from 'inquirer';

import { NamedAction } from './actions/NamedAction';
import container from './container';
import { CliService } from './services/CliService';
import { ConsoleService } from './services/ConsoleService';
import { GitService } from './services/git/GitService';

const displayBanner = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    text(
      'Reactionable',
      {
        font: 'Small Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        process.stdout.write(`\n\n${data}\n\n`);
        resolve();
      }
    );
  });
};

export const run = async (): Promise<boolean> => {
  try {
    container.get(CliService).initRunStartDate();

    // Display banner
    await displayBanner();
    const { action } = await prompt<{ action: NamedAction }>([
      {
        name: 'action',
        message: 'What do you want to do?',
        type: 'list',
        choices: [
          ...container.getAll<NamedAction>('Action').map((action) => ({
            name: action.getName(),
            value: action,
          })),
        ],
      },
    ]);

    const { projectDir } = await prompt([
      {
        type: 'input ',
        name: 'projectDir',
        message: `Where to you you want to ${action.getName().toLowerCase()} (path)?`,
        default: process.cwd(),
        filter: (input) => resolve(input),
      },
    ]);

    const realpath = resolve(projectDir);

    // Execute action
    await action.run({ realpath });

    // Push git commits if any
    await container.get(GitService).pushCommits(realpath);

    return true;
  } catch (err) {
    container.get(ConsoleService).error(err);
    return false;
  }
};
