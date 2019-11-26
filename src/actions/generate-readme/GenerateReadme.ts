import { prompt } from 'inquirer';
import { injectable, inject } from 'inversify';
import { IAction } from '../IAction';
import { error, success, info, exec, getNpmCmd } from '../../plugins/Cli';
import AddVersioning from '../add-versioning/AddVersioning';

@injectable()
export default class GenerateReadme implements IAction<{ mustPrompt: boolean }> {


    constructor(
        @inject(AddVersioning) private addVersioning: AddVersioning,
    ) { }


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
        const readmeMdGeneratorCmd = getNpmCmd('readme-md-generator');
        if (!readmeMdGeneratorCmd) {
            return error('Unable to generate README.md file, install globally "readme-md-generator" or "npx"');
        }
        await exec(readmeMdGeneratorCmd + ' -y', realpath);
        success('README.md file has been generated in "' + realpath + '"');

        const versioningAdapter = await this.addVersioning.detectAdapter(realpath);
        if (!versioningAdapter) {
            return;
        }

        await versioningAdapter.commitFiles(
            realpath,
            `Generate README.md file`,
            'chore'
        );

    }

}