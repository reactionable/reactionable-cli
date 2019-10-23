import { existsSync, mkdirSync, writeFileSync, readFile, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import { render } from 'mustache';

export interface TemplateConfig {
    [key: string]: string | TemplateConfig;
}

export const renderTemplate = async (dirPath: string, config: TemplateConfig, view: Object): Promise<void> => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    for (const dir of Object.keys(config)) {
        const templateConfig = config[dir];
        const templatePath = resolve(
            dirPath,
            render(dir, view)
        );

        if ('string' === typeof templateConfig) {
            mkdirSync(dirname(templatePath), { recursive: true });

            await createFileFromTemplate(
                templatePath,
                templateConfig,
                view
            );
            continue;
        }

        mkdirSync(templatePath, { recursive: true });
        await renderTemplate(templatePath, templateConfig, view);
    }
}

export const createFileFromTemplate = async (filePath: string, template: string, view: Object, encoding = 'utf8') => {
    const parentDir = dirname(filePath);
    if (!existsSync(parentDir)) {
        throw new Error('Unable to create file "' + filePath + '", directory "' + parentDir + '" does not exist');
    }

    const fileContent = render(template, view);

    if (
        existsSync(filePath)
        && Buffer.compare(
            readFileSync(filePath),
            Buffer.from(fileContent)
        ) !== 0
    ) {
        const { override } = await prompt([
            {
                type: 'confirm',
                name: 'override',
                message: 'File "' + filePath + '" exists already, ' + chalk.red('override it?'),
            },
        ]);

        if (!override) {
            return;
        }
    }

    writeFileSync(filePath, fileContent, encoding);
}