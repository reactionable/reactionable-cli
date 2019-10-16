import { prompt } from 'inquirer';
import { injectable } from 'inversify'
import container from './container';
import { IRealpathRunnable } from '../../IRealpathRunnable';
import { IUIFrameworkAction } from './ui-frameworks/IUIFrameworkAction';

@injectable()
export default class AddUIFramework implements IRealpathRunnable {
    async run(options) {
        const answer = await prompt([
            {
                name: 'uiFramework',
                message: 'Wich UI framework do you want to add?',
                type: 'list',
                choices: container.getAll<IUIFrameworkAction>('UIFramework').map(uiFramework => ({
                    'name': uiFramework.getName(),
                    'value': uiFramework,
                })),
            },
        ]);
        await answer.uiFramework.run(options);
    }
}