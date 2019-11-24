import { prompt, registerPrompt } from 'inquirer';
import * as inquirerAutocompletePrompt from 'inquirer-autocomplete-prompt';
import { text } from 'figlet';
import container from './container';
import { IAction } from './actions/IAction';
import { error } from './plugins/Cli';
import { resolve, dirname, basename } from 'path';
import { statSync, readdirSync, existsSync, Stats } from 'fs';

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

        registerPrompt('autocomplete', inquirerAutocompletePrompt);

        const { projectDir } = await prompt([
            {
                type: 'autocomplete',
                name: 'projectDir',
                message: 'Where to you you want to ' + answer.action.getName().toLowerCase() + ' (path)?',
                source: async (answersSoFar, input) => {
                    if (!input) {
                        return [resolve('')];
                    }
                    const path = resolve(input);

                    let dirPath: string;
                    let currentBasename: RegExp;


                    if (existsSync(path)) {
                        dirPath = path;
                    }
                    else {
                        dirPath = dirname(path);
                        currentBasename = new RegExp('^' + basename(path), 'i');
                    }

                    const stat = statSync(dirPath);
                    if (stat.isDirectory()) {
                        return readdirSync(dirPath).map(file => resolve(dirPath, file)).filter(file => {
                            let fileStat: Stats;
                            try {
                                fileStat = statSync(file);
                            } catch (error) {
                                return false;
                            }
                            if (!fileStat.isDirectory()) {
                                return false;
                            }
                            if (!currentBasename) {
                                return true;
                            }
                            return !!currentBasename.exec(basename(file));
                        });
                    }

                    return [];
                }
            },
        ]);

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