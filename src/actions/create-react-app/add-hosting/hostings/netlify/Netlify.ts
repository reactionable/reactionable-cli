import { injectable } from 'inversify';
import { IHostingAction } from '../IHostingAction';
import { success, info, error, exec, getNodeVersion, getCmd } from '../../../../../plugins/Cli';
import { getPackageInfo } from '../../../../../plugins/Package';
import { getGitCurrentBranch } from '../../../../../plugins/Git';
import { renderTemplate } from '../../../../../plugins/Template';
// Templates
import netlifyTemplate from './templates/netlify.toml.template';


@injectable()
export default class Netlify implements IHostingAction {
    getName() {
        return 'Netlify (https://aws-amplify.github.io/)';
    }

    async run({ realpath }) {

        // Add netlify default configuration files
        info('Configure Netlify...');

        const projectName = getPackageInfo(realpath, 'name');

        renderTemplate(
            realpath,
            {
                'netlify.toml': netlifyTemplate,
            },
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