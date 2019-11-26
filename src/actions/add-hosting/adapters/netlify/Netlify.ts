import { injectable } from 'inversify';
import { resolve } from 'path';
import { success, info, error, exec, getNodeVersion, getNpmCmd } from '../../../../plugins/Cli';
import { getPackageInfo } from '../../../../plugins/package/Package';
import { getGitCurrentBranch, getGitRemoteOriginUrl } from '../../../../plugins/Git';
import { renderTemplateFile } from '../../../../plugins/template/Template';
import { AbstractAdapter } from '../../../AbstractAdapter';
import { fileExistsSync } from '../../../../plugins/File';
import { FileFactory } from '../../../../plugins/file/FileFactory';
import { TomlFile } from '../../../../plugins/file/TomlFile';

@injectable()
export default class Netlify extends AbstractAdapter {

    protected name = 'Netlify (https://aws-amplify.github.io/)';

    async isEnabled(realpath: string): Promise<boolean> {
        return fileExistsSync(resolve(realpath, 'netlify.toml'));
    }

    async run({ realpath }) {

        // Add netlify default configuration files
        info('Configure Netlify...');
        const projectName = getPackageInfo(realpath, 'name');

        const netlifyFilePath = resolve(realpath, 'netlify.toml');

        await FileFactory.fromFile<TomlFile>(netlifyFilePath).appendContent(await renderTemplateFile(
            'add-hosting/netlify/netlify.toml',
            {
                nodeVersion: getNodeVersion(),
                projectBranch: getGitCurrentBranch(realpath, 'master'),
                projectPath: realpath,
                projectName,
            })
        ).saveFile();

        // Configure    netlify    
        const cmd = getNpmCmd('netlify');
        if (!cmd) {
            return error('Unable to configure Netlify, please install globally "@netlify/cli" or "npx"');
        }

        // Check if netlify is configured
        let netlifyConfig: { name: string } | undefined = undefined;
        let gitRemoteUrl = getGitRemoteOriginUrl(realpath, false);
        if (gitRemoteUrl) {
            gitRemoteUrl = gitRemoteUrl.replace(/\.git$/, '');

            const sitesListData = await exec(cmd + ' api listSites --data ' + JSON.stringify(JSON.stringify({ filter: "all" })), realpath, true);
            const sitesList = JSON.parse(sitesListData);
            for (const site of sitesList) {
                let siteRepoUrl = site?.build_settings?.repo_url;
                if (!siteRepoUrl) {
                    continue;
                }
                siteRepoUrl = siteRepoUrl.replace(/\.git$/, '');
                if (siteRepoUrl === gitRemoteUrl) {
                    netlifyConfig = site;
                    break;
                }
            }
        }

        if (netlifyConfig) {
            success('Netlify is already configured for site "' + netlifyConfig.name + '"');
            return;
        }

        await exec(cmd + ' sites:create -n ' + projectName + ' --with-ci', realpath);
        success('Netlify has been configured in "' + realpath + '"');
    }
}
