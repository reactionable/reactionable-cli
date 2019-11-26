import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { Result } from 'parse-github-url';
import { success, info, error, exec } from '../../../plugins/Cli';
import { getGitRemoteOriginUrl, initializedGit, getGitCmd, parseGitRemoteUrl } from '../../../plugins/Git';
import { installPackages, updatePackageJson, hasInstalledPackage, hasPackageJsonConfig } from '../../../plugins/package/Package';
import { renderTemplateTree } from '../../../plugins/template/Template';
import { AbstractAdapter } from '../../AbstractAdapter';
import { IVersioningAdapter } from '../IVersioningAdapter';

@injectable()
export default abstract class AbstractVersioning extends AbstractAdapter implements IVersioningAdapter {

    static conventionalCommitsPackages = [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'cz-conventional-changelog',
        'husky',
    ];

    static conventionalCommitsConfig = {
        'husky': {
            'hooks': {
                'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
            },
        },
        'config': {
            'commitizen': {
                'path': './node_modules/cz-conventional-changelog'
            },
        },
    };

    async run({ realpath }) {
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

            const gitCmd = getGitCmd();
            if (!gitCmd) {
                return error('Unable to configure Git, please "Git"');
            }

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

        if (!this.hasConventionalCommits(realpath)) {
            const { conventionalCommits } = await prompt([
                {
                    type: 'confirm',
                    name: 'conventionalCommits',
                    message: 'Do you want to use Conventional Commits (https://www.conventionalcommits.org)',
                },
            ]);

            if (conventionalCommits) {
                await installPackages(realpath, AbstractVersioning.conventionalCommitsPackages);

                await updatePackageJson(realpath, AbstractVersioning.conventionalCommitsConfig);

                await renderTemplateTree(
                    realpath,
                    'add-versioning',
                    ['commitlint.config.js'],
                );
            }
        }

        await this.commitFiles(realpath, 'Initial commit', 'feat');
    }

    validateGitRemote(input: string): string | Result {
        return parseGitRemoteUrl(input) || `Could not parse Git remote from given url "${input}"`;
    }

    hasConventionalCommits(realpath: string): boolean {
        for (const packageName of AbstractVersioning.conventionalCommitsPackages) {
            if (!hasInstalledPackage(realpath, packageName)) {
                return false;
            }
        }
        return hasPackageJsonConfig(realpath, AbstractVersioning.conventionalCommitsConfig);
    }

    getCommitMessage(realpath: string, commitMessage: string, commitMessageType: string) {
        if (!this.hasConventionalCommits(realpath)) {
            return commitMessage.charAt(0).toUpperCase() + commitMessage.slice(1);
        }
        return `${commitMessageType.toLowerCase()}: ${commitMessage.charAt(0).toLowerCase() + commitMessage.slice(1)}`;
    }

    async commitFiles(realpath: string, commitMessage: string, commitMessageType: string) {
        const gitCmd = getGitCmd();
        if (!gitCmd) {
            return error('Unable to configure Git, please "Git"');
        }

        // Determine if Git working directory is clean 
        const status = await exec(gitCmd + ' status --porcelain', realpath, true);
        if (!status) {
            return;
        }

        info('Commit files...');
        const answer = await prompt([{
            type: 'input',
            name: 'commitMessage',
            default: this.getCommitMessage(realpath, commitMessage, commitMessageType),
            message: 'Commit message',
        }]);
        commitMessage = answer.commitMessage;
        await exec(gitCmd + ' fetch --all', realpath);
        await exec(gitCmd + ' add .', realpath);
        await exec(gitCmd + ' commit -am "' + commitMessage + '"', realpath);
        await exec(gitCmd + ' push --all', realpath);
        success('Files have been commited and pushed');
    }
}