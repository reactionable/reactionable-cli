import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { which } from 'shelljs';
import { IVersioningAction } from '../IVersioningAction';
import { success, info, error, exec } from '../../../../../plugins/Cli';
import { getGitRemoteOriginUrl, getGitCurrentBranch } from '../../../../../plugins/Git';

@injectable()
export default class Git implements IVersioningAction {
    getName() {
        return 'Git';
    }

    async run({ realpath }) {
        info('Configure Git...');
        const gitCmd = this.getGitCmd();
        if (!gitCmd) {
            return error('Unable to configure Git, please "Git"');
        }
        await exec(gitCmd + ' init', realpath);
        success('Git has been configured in "' + realpath + '"');

        const gitRemoteOriginUrl = getGitRemoteOriginUrl(realpath);
        if (!gitRemoteOriginUrl) {
            const { remoteOriginUrl } = await prompt([{
                type: 'input',
                name: 'remoteOriginUrl',
                message: 'Remote origin url (https://gitxxx.com/username/new_repo)',
                validate: function (input) {
                    const URL = require('url').URL;

                    const stringIsAValidUrl = (s) => {
                      try {
                        new URL(s);
                        return true;
                      } catch (err) {
                        return false;
                      }
                    };
                    if(stringIsAValidUrl(input)){
                        return true;
                    }
                    return 'Remote origin url must be a valid url';
                },
            }]);

            const currentBranch = getGitCurrentBranch(realpath);
            await exec(gitCmd + ' remote add origin ' + remoteOriginUrl);
            await exec(gitCmd + ' push -u origin ' + (currentBranch ? currentBranch : 'master'));
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

    getGitCmd(): string | null {
        if (which('git')) {
            return 'git';
        }
        return null;
    }

}