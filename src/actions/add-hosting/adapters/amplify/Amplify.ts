import { injectable } from 'inversify';
import { prompt } from 'inquirer';
import { resolve } from 'path';
import { success, info, error, exec, getNpmCmd } from '../../../../plugins/Cli';
import { getPackageInfo } from '../../../../plugins/package/Package';
import { getGitCurrentBranch } from '../../../../plugins/Git';
import { renderTemplateTree } from '../../../../plugins/template/Template';
import { AbstractAdapterWithPackage } from '../../../AbstractAdapterWithPackage';
import { FileFactory } from '../../../../plugins/file/FileFactory';
import { TypescriptFile } from '../../../../plugins/file/TypescriptFile';

@injectable()
export default class Amplify extends AbstractAdapterWithPackage {
    protected name = 'Amplify (https://aws-amplify.github.io/)';
    protected packageName = '@reactionable/amplify';

    async run({ realpath }) {
        await super.run({ realpath });

        // Add amplify config in App component
        info('Add amplify config in App component...');
        const appFile = resolve(realpath, 'src/App.tsx');
        await FileFactory.fromFile<TypescriptFile>(appFile).setImports(
            [
                {
                    packageName: '@reactionable/amplify',
                    modules: {
                        'useIdentityContextProviderProps': '',
                        'IIdentityContextProviderProps': '',
                    },
                },
                {
                    packageName: 'aws-amplify',
                    modules: {
                        'Amplify': 'default',
                    },
                },
                {
                    packageName: './aws-exports',
                    modules: {
                        'awsconfig': 'default',
                    },
                },
            ],
            [
                {
                    packageName: '@reactionable/core',
                    modules: {
                        'IIdentityContextProviderProps': '',
                    },
                },
            ]
        ).appendContent(
            'Amplify.configure(awsconfig);',
            'import \'./App.scss\';'
        ).saveFile();

        // Add amplify default configuration files
        info('Configure Amplify...');
        const projectBranch = getGitCurrentBranch(realpath, 'master');
        const projectName = getPackageInfo(realpath, 'name');
        const projectVersion = getPackageInfo(realpath, 'version');

        await renderTemplateTree(
            realpath,
            'add-hosting/amplify',
            {
                'amplify': {
                    '.config': ['project-config.json'],
                    'backend': ['backend-config.json'],
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
        const amplifyCmd = getNpmCmd('amplify');
        if (!amplifyCmd) {
            return error('Unable to configure Amplify, please install globally "@aws-amplify/cli" or "npx"');
        }

        // Amplify config
        let amplifyInitCmd = amplifyCmd + ' init --amplify ' + JSON.stringify(JSON.stringify({
            envName: getGitCurrentBranch(realpath, 'master'),
        })) + ' --awscloudformation ' + JSON.stringify(JSON.stringify({
            useProfile: true,
            profileName: 'default',
        }));
        await exec(amplifyInitCmd, realpath);
        await exec(amplifyCmd + ' hosting add', realpath);

        const { addAuth } = await prompt([
            {
                type: 'confirm',
                name: 'addAuth',
                message: 'Do you want to add Authentication (https://aws-amplify.github.io/docs/js/authentication)',
            },
        ]);

        if (addAuth) {
            await exec(amplifyCmd + ' add auth', realpath);
            await exec(amplifyCmd + ' push', realpath);

            await FileFactory.fromFile(appFile).replaceContent(
                /identity: undefined,.*$/m,
                'identity: useIdentityContextProviderProps(),'
            ).saveFile();
        }

        const { addApi } = await prompt([
            {
                type: 'confirm',
                name: 'addApi',
                message: 'Do you want to add an API (https://aws-amplify.github.io/docs/js/api)',
            },
        ]);

        if (addApi) {
            await exec(amplifyCmd + ' add auth', realpath);
            await exec(amplifyCmd + ' push', realpath);
        }

        success('Amplify has been configured in "' + realpath + '"');
    }
}