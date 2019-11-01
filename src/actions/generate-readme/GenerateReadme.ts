import { prompt } from 'inquirer';
import { injectable } from 'inversify';
import { IAction } from '../IAction';
import { error, success, info, exec, getCmd } from '../../plugins/Cli';

@injectable()
export default class GenerateReadme implements IAction<{ mustPrompt: boolean }> {

    getName() {
        return 'Generate README.md file';
    }

    async run({ realpath, mustPrompt = false }) {
        info('Generating README.md file...');
        if (mustPrompt) {
            const { override } = await prompt([
                {
                    type: 'confirm',
                    name: 'override',
                    message: 'Do you want to generate the README file?',
                },
            ]);

            if (!override) {
                return;
            }
        }
        const readmeMdGeneratorCmd = getCmd('readme-md-generator');
        if (!readmeMdGeneratorCmd) {
            return error('Unable to generate README.md file, install globally "readme-md-generator" or "npx"');
        }
        await exec(readmeMdGeneratorCmd+ ' -y', realpath);
        success('README.md file has been generated in "' + realpath + '"');
    }

}