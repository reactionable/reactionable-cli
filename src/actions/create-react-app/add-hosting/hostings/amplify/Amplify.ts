import { injectable } from 'inversify';
import { which } from 'shelljs';
import { mkdirSync } from 'fs';
import { resolve } from 'path';
import { IHostingAction } from '../IHostingAction';
import { success, info, error, exec } from '../../../../../plugins/Cli';
import { getPackageInfo } from '../../../../../plugins/Package';
import { createFileFromTemplate } from '../../../../../plugins/File';
import { getGitCurrentBranch } from '../../../../../plugins/Git';

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

        const amplifyConfig = {
            '.config': {
                'local-aws-info.json': localAwsInfoTemplate,
                'local-env-info.json': localEnvInfoTemplate,
                'project-config.json': projectConfigTemplate,
            },
            'backend': {
                'backend-config.json': backendConfigTemplate,
            },
        };

        Object.keys(amplifyConfig).forEach(dir => {
            const amplifyDir = resolve(realpath, 'amplify', dir);
            mkdirSync(amplifyDir, { recursive: true });

            const currentBranch = getGitCurrentBranch(realpath);
            const view = {
                projectBranch: JSON.stringify(currentBranch ? currentBranch : 'master'),
                projectPath: JSON.stringify(realpath),
                projectName: JSON.stringify(getPackageInfo(realpath, 'name')),
            }

            const templates = amplifyConfig[dir];
            Object.keys(templates).forEach(file => {
                createFileFromTemplate(
                    resolve(amplifyDir, file),
                    templates[file],
                    view
                );
            });

        });

        // Configure amplify        
        const amplifyCmd = this.getAmplifyCmd();
        if (!amplifyCmd) {
            return error('Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"');
        }
        await exec(amplifyCmd + ' init', realpath);
        success('Amplify has been configured in "' + realpath + '"');
    }

    getAmplifyCmd(): string | null {
        if (which('amplify')) {
            return 'amplify';
        }
        if (which('npx')) {
            return 'npx amplify';
        }
        return null;
    }

}