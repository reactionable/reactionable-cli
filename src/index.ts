import { prompt } from 'inquirer';
import { text } from 'figlet';
import container from './container';
import { IAction } from './actions/IAction';
import { error, initRunStartDate } from './plugins/Cli';
import { resolve } from 'path';

const displayBanner = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        text('Reactionable', {
            font: 'Small Slant',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, (err, data) => {
            if (err) {
                return reject(err);
            }
            process.stdout.write("\n\n" + data + "\n\n");
            resolve();
        });
    });
}

export const run = async (): Promise<boolean> => {
    try {
        initRunStartDate();
        
        // Display banner
        await displayBanner();
        const answer = await prompt<{ action: IAction }>([
            {
                name: 'action',
                message: 'What do you want to do?',
                type: 'list',
                choices: [...container.getAll<IAction>('Action').map(action => ({
                    'name': action.getName(),
                    'value': action,
                })),],
            },
        ]);

        const { projectDir } = await prompt([{
            type: 'input ',
            name: 'projectDir',
            message: 'Where to you you want to ' + answer.action.getName().toLowerCase() + ' (path)?',
            default: resolve(''),
            filter(input) {
                return resolve(input);
            },
        }]);

        const realpath = resolve(projectDir);

        // Execute action
        await answer.action.run({ realpath });
        return true;
    }
    catch (err) {
        error(err);
        return false;
    }
};