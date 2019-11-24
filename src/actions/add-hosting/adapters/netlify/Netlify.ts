import { injectable } from 'inversify';
import { success, info, error, exec, getNodeVersion, getCmd } from '../../../../plugins/Cli';
import { getPackageInfo } from '../../../../plugins/package/Package';
import { getGitCurrentBranch } from '../../../../plugins/Git';
import { renderTemplateTree } from '../../../../plugins/template/Template';
import { AbstractAdapterWithPackage } from '../../../AbstractAdapterWithPackage';

@injectable()
export default class Netlify extends AbstractAdapterWithPackage {
    protected name = 'Netlify (https://aws-amplify.github.io/)';
    protected packageName = '@reactionable/netlify';

    async run({ realpath }) {
        await super.run({ realpath });

        // Add netlify default configuration files
        info('Configure Netlify...');
        const projectName = getPackageInfo(realpath, 'name');

        await renderTemplateTree(
            realpath,
            'add-hosting/netlify',
            ['netlify.toml'],
            {
                nodeVersion: getNodeVersion(),
                projectBranch: getGitCurrentBranch(realpath, 'master'),
                projectPath: realpath,
                projectName,
            }
        );

        // Configure amplify        
        const cmd = getCmd('netlify');
        if (!cmd) {
            return error('Unable to configure Netlify, please install globally "@netlify/cli" or "npx"');
        }
        await exec(cmd + ' sites:create -n ' + projectName + ' --with-ci', realpath);
        success('Netlify has been configured in "' + realpath + '"');
    }
}