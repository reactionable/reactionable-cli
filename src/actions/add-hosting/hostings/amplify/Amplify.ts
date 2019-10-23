import { injectable } from 'inversify';
import { IHostingAction } from '../IHostingAction';
import { success, info, error, exec, getCmd } from '../../../../plugins/Cli';
import { getPackageInfo } from '../../../../plugins/Package';
import { getGitCurrentBranch } from '../../../../plugins/Git';
import { renderTemplate } from '../../../../plugins/Template';
// Templates
import projectConfigTemplate from './templates/project-config.json.template';
import backendConfigTemplate from './templates/backend-config.json.template';

@injectable()
export default class Amplify implements IHostingAction {
    getName() {
        return 'Amplify (https://aws-amplify.github.io/)';
    }

    async run({ realpath }) {

        // Add amplify default configuration files
        info('Configure Amplify...');

        const projectBranch = getGitCurrentBranch(realpath, 'master');
        const projectName = getPackageInfo(realpath, 'name');
        const projectVersion = getPackageInfo(realpath, 'version');
        await renderTemplate(
            realpath,
            {
                'amplify': {
                    '.config': {
                        'project-config.json': projectConfigTemplate,
                    },
                    'backend': {
                        'backend-config.json': backendConfigTemplate,
                    },
                },
            },
            {
                projectVersion: JSON.stringify(projectVersion),
                projectBranch: JSON.stringify(projectBranch),
                projectPath: JSON.stringify(realpath),
                projectName: JSON.stringify(projectName),
            }
        );


        // Configure amplify        
        let amplifyCmd = getCmd('amplify');
        if (!amplifyCmd) {
            return error('Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"');
        }

        amplifyCmd += ' init'
        // Amplify config
        amplifyCmd += ' --amplify ' + JSON.stringify(JSON.stringify({
            envName: getGitCurrentBranch(realpath, 'master'),
        }));        
        amplifyCmd += ' --awscloudformation ' + JSON.stringify(JSON.stringify({
            useProfile: true,
            profileName: 'default',
        }));

        await exec(amplifyCmd + ' init', realpath);
        success('Amplify has been configured in "' + realpath + '"');
    }
}