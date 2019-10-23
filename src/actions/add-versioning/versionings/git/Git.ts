import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import * as parseGitRemote from 'parse-github-url';
import { IVersioningAction } from '../IVersioningAction';
import { success, info, error, exec } from '../../../../plugins/Cli';
import { getGitRemoteOriginUrl, getGitCurrentBranch, initializedGit, getGitCmd } from '../../../../plugins/Git';

@injectable()
export default class Git implements IVersioningAction {
    getName() {
        return 'Git';
    }

    async run({ realpath }) {

        const gitCmd = getGitCmd();
        if (!gitCmd) {
            return error('Unable to configure Git, please "Git"');
        }

        info('Configure Git...');
        await initializedGit(realpath);
        success('Git has been configured in "' + realpath + '"');

        const gitRemoteOriginUrl = getGitRemoteOriginUrl(realpath);
        if (!gitRemoteOriginUrl) {
            const { remoteOriginUrl } = await prompt([{
                type: 'input',
                name: 'remoteOriginUrl',
                message: 'Remote origin url (https://gitxxx.com/username/new_repo)',
                validate: input => (parseGitRemote(input) ? true : `Could not parse Git remote ${input}`),
            }]);

            const currentBranch = getGitCurrentBranch(realpath, 'master');
            await exec(gitCmd + ' remote add origin ' + remoteOriginUrl);
            await exec(gitCmd + ' push -u origin ' + currentBranch);
        }

        const { commitMessage } = await prompt([{
            type: 'input',
            name: 'commitMessage',
            default: 'Initial commit',
            message: 'Commit message',
        }]);

        info('Push files...');
        await exec(gitCmd + ' add .', realpath);
        await exec(gitCmd + ' commit -am "' + commitMessage + '"', realpath);
        await exec(gitCmd + ' push', realpath);
        success('Files have been pushed');
    }

    

}