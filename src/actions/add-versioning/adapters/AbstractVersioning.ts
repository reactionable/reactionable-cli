import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { Result } from 'parse-github-url';
import { success, info, error, exec } from '../../../plugins/Cli';
import { getGitRemoteOriginUrl, initializedGit, getGitCmd, parseGitRemoteUrl } from '../../../plugins/Git';
import { installPackages, updatePackageJson } from '../../../plugins/package/Package';
import { renderTemplateTree } from '../../../plugins/template/Template';
import { AbstractAdapter } from '../../AbstractAdapter';

@injectable()
export default abstract class AbstractVersioning extends AbstractAdapter {

    async run({ realpath }) {

        const gitCmd = getGitCmd();
        if (!gitCmd) {
            return error('Unable to configure Git, please "Git"');
        }

        await initializedGit(realpath);

        const gitRemoteOriginUrl = getGitRemoteOriginUrl(realpath, false);
        if (!gitRemoteOriginUrl) {
            info('Define git remote url...');
            const { remoteOriginUrl } = await prompt([{
                type: 'input',
                name: 'remoteOriginUrl',
                message: 'Remote origin url (https://gitxxx.com/username/new_repo)',
                validate: input => {
                    const result = this.validateGitRemote(input);
                    return 'string' === typeof result ? result : true;
                },
            }]);

            await exec(gitCmd + ' remote add origin ' + remoteOriginUrl, realpath);
            await exec(gitCmd + ' push --all', realpath);
            info('Git remote url as been set to "' + remoteOriginUrl + '"');
        }

        await updatePackageJson(realpath, {
            'repository': {
                'type': 'git',
                'url': 'git+' + gitRemoteOriginUrl,
            },
        });

        const { conventionalCommits } = await prompt([
            {
                type: 'confirm',
                name: 'conventionalCommits',
                message: 'Do you want to use Conventional Commits (https://www.conventionalcommits.org)',
            },
        ]);

        if (conventionalCommits) {
            await installPackages(realpath, [
                '@commitlint/cli',
                '@commitlint/config-conventional',
                'cz-conventional-changelog',
                'husky',
            ]);

            await updatePackageJson(realpath, {
                'husky': {
                    'hooks': {
                        'prepare-commit-msg': 'prepare-commit-msg',
                        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
                    },
                },
                'config': {
                    'commitizen': {
                        'path': './node_modules/cz-conventional-changelog'
                    },
                },
            });

            await renderTemplateTree(
                realpath,
                'add-versioning',
                ['commitlint.config.js'],
            );
        }

        // Determine if Git working directory is clean 
        if (!await exec(gitCmd + ' status --porcelain', realpath, true)) {
            return;
        }

        info('Commit files...');
        const { commitMessage } = await prompt([{
            type: 'input',
            name: 'commitMessage',
            default: (conventionalCommits ? 'feat:' : '') + 'Initial commit',
            message: 'Commit message',
        }]);
        await exec(gitCmd + ' fetch --all', realpath);
        await exec(gitCmd + ' add .', realpath);
        await exec(gitCmd + ' commit -am "' + commitMessage + '"', realpath);
        await exec(gitCmd + ' push --all', realpath);
        success('Files have been pushed');
    }

    validateGitRemote(input: string): string | Result {
        return parseGitRemoteUrl(input) || `Could not parse Git remote from given url "${input}"`;
    }
}