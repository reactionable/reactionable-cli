
import { IOptions } from './IRunnable';
import { IRealpathRunnable } from './IRealpathRunnable';
import { Container, injectable } from 'inversify';
import { info, success } from '../plugins/Cli';
import { prompt } from 'inquirer';
import { red } from 'chalk';
import { IAdapter } from './IAdapter';

@injectable()
export abstract class AbstractActionWithAdapters<A extends IAdapter, O extends IOptions = {}> implements IRealpathRunnable<O> {

    protected abstract name: string;
    protected abstract container: Container;

    getName() {
        return this.name;
    }

    protected getAdapters(): A[] {
        return this.container.getAll<A>('Adapter');
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

    async run(options) {
        const name = this.getName();

        info(`Adding ${name}...`);

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
        }
        else {
            const answer = await prompt<{ adapter: A | null }>([{
                name: 'adapter',
                message: `Wich ${name} do you want to add?`,
                type: 'list',
                choices: [
                    ...this.getAdapters().map(adapter => ({
                        'name': adapter.getName(),
                        'value': adapter,
                    })),
                    {
                        'name': 'None',
                        'value': null,
                    },
                ],
            }]);
            adapter = answer.adapter;
        }
        if (!adapter) {
            return;
        }
        await adapter.run(options);
        success(`${name} has been added in "${options.realpath}"`);
    }
}