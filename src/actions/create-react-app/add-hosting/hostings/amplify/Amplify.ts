import { injectable } from 'inversify';
import { IHostingAction } from '../IHostingAction';
import { success, info, error, exec, getCmd } from '../../../../../plugins/Cli';
import { getPackageInfo } from '../../../../../plugins/Package';
import { getGitCurrentBranch } from '../../../../../plugins/Git';
import { renderTemplate } from '../../../../../plugins/Template';
// Templates
import localAwsInfoTemplate from './templates/local-aws-info.json.template';
import localEnvInfoTemplate from './templates/local-env-info.json.template';
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
        renderTemplate(
            realpath,
            {
                '.config': {
                    'local-aws-info.json': localAwsInfoTemplate,
                    'local-env-info.json': localEnvInfoTemplate,
                    'project-config.json': projectConfigTemplate,
                },
                'backend': {
                    'backend-config.json': backendConfigTemplate,
                },
            },
            {
                projectBranch: JSON.stringify(projectBranch),
                projectPath: JSON.stringify(realpath),
                projectName: JSON.stringify(projectName),
            }
        );


        // Configure amplify        
        const amplifyCmd = getCmd('amplify');
        if (!amplifyCmd) {
            return error('Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"');
        }
        await exec(amplifyCmd + ' init', realpath);
        success('Amplify has been configured in "' + realpath + '"');
    }
}