import { prompt } from 'inquirer';
import { injectable } from 'inversify'
import container from './container';
import { success, info } from '../../plugins/Cli';
import { IRealpathRunnable } from '../IRealpathRunnable';
import { IAdapter } from '../IAdapter';

@injectable()
export default class AddUIFramework implements IRealpathRunnable {
    async run(options) {
        info('Adding UI framemork...');
        const { uiFramework } = await prompt<{ uiFramework: IAdapter | false }>([{
            name: 'uiFramework',
            message: 'Wich UI framework do you want to add?',
            type: 'list',
            choices: [
                ...container.getAll<IAdapter>('Adapter').map(uiFramework => ({
                    'name': uiFramework.getName(),
                    'value': uiFramework,
                })),
                {
                    'name': 'None',
                    'value': false,
                },
            ],
        }]);

        if (!uiFramework) {
            return;
        }

        await uiFramework.run(options);
        success('UI framemork has been added in "' + options.realpath + '"');
    }
}