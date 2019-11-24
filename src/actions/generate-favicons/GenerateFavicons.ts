import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { basename } from 'path';
import { IAction } from '../IAction';
import { success, info } from '../../plugins/Cli';

@injectable()
export default class GenerateFavicons implements IAction<{ mustPrompt: boolean }> {

    getName() {
        return 'Generate favicons';
    }

    async run({ realpath, mustPrompt = false }) {
        info('Generating favicons...');
        if (mustPrompt) {
            const { confirm } = await prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Do you want to generate favicons?',
                },
            ]);

            if (!confirm) {
                return;
            }
        }

        const isPublicDir = basename(realpath) === 'public';
        await this.executeFavicon();
        success('README.md file has been generated in "' + realpath + '"');
    }

    async executeFavicon(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }

}