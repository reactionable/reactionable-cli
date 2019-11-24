import { injectable } from 'inversify';
import { getGitRemoteOriginUrl } from '../../../../plugins/Git';
import { updatePackageJson } from '../../../../plugins/package/Package';
import AbstractVersioning from '../AbstractVersioning';
import { Result } from 'parse-github-url';

@injectable()
export default class Git extends AbstractVersioning {
    protected name = 'Github';

    async isEnabled(realpath: string): Promise<boolean> {
        const parsedGitRemote = getGitRemoteOriginUrl(realpath, false);
        return !!(parsedGitRemote && this.validateGitRemote(parsedGitRemote));
    }

    async run({ realpath }) {
        await super.run({ realpath });

        const parsedGitRemote = getGitRemoteOriginUrl(realpath, true);
        if (!parsedGitRemote) {
            throw new Error('Unable to parse git remote origin url');
        }

        const repositoryUrl = `https://${parsedGitRemote.host}/${parsedGitRemote.repo}`;
        await updatePackageJson(realpath, {
            'author': {
                'name': parsedGitRemote.owner,
            },
            'bugs': {
                'url': repositoryUrl + '/issues',
            },
        });
    }

    validateGitRemote(input: string): string | Result {

        const result = super.validateGitRemote(input);
        if ('string' === typeof result) {
            return result;
        }

        if (!result.host) {
            return `Could not parse Git remote host from given url "${input}"`;
        }

        if (result.host !== 'github.com') {
            return `Git remote url "${input}" is not a Github url`;
        }

        return result;
    }

}