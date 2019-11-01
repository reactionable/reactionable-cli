import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { IRealpathRunnable } from '../IRealpathRunnable';
import container from './container';
import { IVersioningAction } from './versionings/IVersioningAction';
import { success, info } from '../../plugins/Cli';

@injectable()
export default class AddVersioning implements IRealpathRunnable {
    async run(options) {
        info('Adding Versioning...');
        const { versioning } = await prompt<{ versioning: IVersioningAction | false }>([{
            name: 'versioning',
            message: 'Which versioning do you want to add?',
            type: 'list',
            choices: [
                ...container.getAll<IVersioningAction>('Versioning').map(versioning => ({
                    'name': versioning.getName(),
                    'value': versioning,
                })),
                {
                    'name': 'None',
                    'value': false,
                },
            ],
        }]);

        if (!versioning) {
            return;
        }

        await versioning.run(options);
        success('Versioning has been added in "' + options.realpath + '"');
    }
}