import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { IRealpathRunnable } from '../../IRealpathRunnable';
import container from './container';
import { IHostingAction } from './hostings/IHostingAction';

@injectable()
export default class AddHosting implements IRealpathRunnable {
    async run(options) {
        const answer = await prompt([
            {
                name: 'hosting',
                message: 'Which hosting do you want to add?',
                type: 'list',
                choices: container.getAll<IHostingAction>('Hosting').map(hosting => ({
                    'name': hosting.getName(),
                    'value': hosting,
                })),
            },
        ]);

        await answer.hosting.run(options);
    }
}