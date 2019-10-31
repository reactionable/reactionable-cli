import { injectable } from 'inversify';
import { IHostingAction } from '../IHostingAction';
import { success, info, error, exec, getCmd } from '../../../../plugins/Cli';
import { getPackageInfo, installPackages } from '../../../../plugins/Package';
import { getGitCurrentBranch } from '../../../../plugins/Git';
import { renderTemplateTree } from '../../../../plugins/Template';
import { addTypescriptImports } from '../../../../plugins/Typescript';
import { replaceInFile, addInFile } from '../../../../plugins/File';
import { resolve } from 'path';

@injectable()
export default class Amplify implements IHostingAction {
    getName() {
        return 'Amplify (https://aws-amplify.github.io/)';
    }

    async run({ realpath }) {

        // Installs packages        
        await installPackages(realpath, ['@reactionable/amplify']);

        // Add amplify config in App component
        info('Add amplify config in App component...');
        const appFile = resolve(realpath, 'src/App.tsx');
        addTypescriptImports(
            appFile,
            [
                {
                    packageName: '@reactionable/amplify',
                    modules: {
                        'configure': '',
                        'useIdentityContextProviderProps': '',
                    },
                },
            ]
        );
        
        addInFile(
            appFile,
            'import awsconfig from \'./aws-exports\';' + "\n" +
            'configure(awsconfig);',
            'import \'./App.scss\';'
        );        
        replaceInFile(
            appFile,
            /identity: undefined,.+$/,
            'identity: useIdentityContextProviderProps(),'
        );

        // Add amplify default configuration files
        info('Configure Amplify...');
        const projectBranch = getGitCurrentBranch(realpath, 'master');
        const projectName = getPackageInfo(realpath, 'name');
        const projectVersion = getPackageInfo(realpath, 'version');

        await renderTemplateTree(
            realpath,
            {
                'amplify': {
                    '.config': {
                        'project-config.json': 'amplify/project-config.json',
                    },
                    'backend': {
                        'backend-config.json': 'amplify/backend-config.json',
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