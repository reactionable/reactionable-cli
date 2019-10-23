import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { IRealpathRunnable } from '../IRealpathRunnable';
import container from './container';
import { IVersioningAction } from './versionings/IVersioningAction';

@injectable()
export default class AddVersioning implements IRealpathRunnable {
    async run(options) {
        const answer = await prompt([
            {
                name: 'versioning',
                message: 'Which versioning do you want to add?',
                type: 'list',
                choices: container.getAll<IVersioningAction>('Versioning').map(versioning => ({
                    'name': versioning.getName(),
                    'value': versioning,
                })),
            },
        ]);

        await answer.versioning.run(options);
    }
}