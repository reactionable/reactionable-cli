import { resolve } from 'path';

import { Cli as Clipanion, Command } from 'clipanion';
import { textSync } from 'figlet';
import { prompt } from 'inquirer';

import { NamedAction } from '../actions/NamedAction';
import container from '../container';
import { CliService } from '../services/CliService';
import { ConsoleService } from '../services/ConsoleService';
import { PackageManagerService } from '../services/package-manager/PackageManagerService';

// run [-v,--verbose] [--name ARG]
class RunCommand extends Command {
  //   @Command.Boolean(`-v,--verbose`)
  //   public verbose = false;

  //   @Command.String(`--name`)
  //   public name?: string;

  @Command.Path(`run`)
  async execute() {
    try {
      container.get(CliService).initRunStartDate();

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
    } catch (err) {
      container.get(ConsoleService).error(err);
    }
  }
}

export class Cli {
  protected cli?: Clipanion;

  protected async initialize(): Promise<void> {
    this.cli = new Clipanion({
      binaryLabel: this.getBinaryLabel(),
      binaryName: `reactionable`,
      binaryVersion: await this.getBinaryVersion(),
      enableColors: true,
    });
    this.cli.register(Command.Entries.Help);
    this.cli.register(Command.Entries.Version);
    this.cli.register(RunCommand);
  }

  protected getBinaryLabel(): string {
    return `\n${textSync('Reactionable', {
      font: 'Small Slant',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    })}`;
  }

  protected getBinaryVersion(): Promise<string | undefined> {
    return container.get(PackageManagerService).getPackageVersion(resolve(__dirname, '../..'));
  }

  async run(): Promise<void> {
    await this.initialize();
    this.cli &&
      this.cli.runExit(process.argv.slice(2), {
        ...Clipanion.defaultContext,
      });
  }
}
