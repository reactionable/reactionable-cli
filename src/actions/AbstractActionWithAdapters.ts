import { red } from 'chalk';
import { prompt } from 'inquirer';
import { inject, injectable } from 'inversify';

import container from '../container';
import { ConsoleService } from '../services/ConsoleService';
import { AdapterAction } from './AdapterAction';
import { RealpathAction, RealpathActionOptions } from './RealpathAction';

export type ActionWithAdaptersOptions = RealpathActionOptions;

@injectable()
export abstract class AbstractActionWithAdapters<
  A extends AdapterAction,
  O extends ActionWithAdaptersOptions = ActionWithAdaptersOptions
> implements RealpathAction<O> {
  protected abstract name: string;
  protected abstract adapterKey: string;

  constructor(@inject(ConsoleService) private readonly consoleService: ConsoleService) {}

  getName(): string {
    return this.name;
  }

  protected getAdapters(): A[] {
    return container.getAll<A>(this.adapterKey);
  }

  async detectAdapter(realpath: string): Promise<A | null> {
    const adapters = this.getAdapters();

    for (const adapter of adapters) {
      if (await adapter.isEnabled(realpath)) {
        return adapter;
      }
    }
    return null;
  }

  async run(options: ActionWithAdaptersOptions): Promise<void> {
    const name = this.getName();

    this.consoleService.info(`Adding ${name}...`);

    let adapter: A | null = await this.detectAdapter(options.realpath);
    if (adapter) {
      const { override } = await prompt([
        {
          type: 'confirm',
          name: 'override',
          message: `${name} "${adapter.getName()}" is already added, ${red('override it?')}`,
        },
      ]);
      if (!override) {
        return;
      }
    } else {
      const answer = await prompt<{ adapter: A | null }>([
        {
          name: 'adapter',
          message: `Wich ${name} do you want to add?`,
          type: 'list',
          choices: [
            ...this.getAdapters().map((adapter) => ({
              name: adapter.getName(),
              value: adapter,
            })),
            {
              name: 'None',
              value: null,
            },
          ],
        },
      ]);
      adapter = answer.adapter;
    }
    if (!adapter) {
      return;
    }

    await adapter.run(options);

    this.consoleService.success(`${name} has been added in "${options.realpath}"`);
  }
}
