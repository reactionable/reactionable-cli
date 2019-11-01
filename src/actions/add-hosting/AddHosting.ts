import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { IAction } from '../IAction';
import container from './container';
import { success, info } from '../../plugins/Cli';
import { IAdapter } from '../IAdapter';

@injectable()
export default class AddHosting implements IAction {

    getName() {
        return 'Add hosting';
    }

    async run(options) {
        info('Adding Hosting...');
        const { hosting } = await prompt<{ hosting: IAdapter | false }>([
            {
                name: 'hosting',
                message: 'Which hosting do you want to add?',
                type: 'list',
                choices: [
                    ...container.getAll<IAdapter>('Adapter').map(hosting => ({
                        'name': hosting.getName(),
                        'value': hosting,
                    })),
                    {
                        'name': 'None',
                        'value': false,
                    },
                ],
            },
        ]);

        if (!hosting) {
            return;
        }

        await hosting.run(options);
        success('Hosting has been added in "' + options.realpath + '"');
    }
}