import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { render } from 'mustache';

export interface TemplateConfig {
    [key: string]: string | TemplateConfig;
}

export const renderTemplate = (dirPath: string, config: TemplateConfig, view: Object) => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    Object.keys(config).forEach(dir => {
        const templateConfig = config[dir];
        const templatePath = resolve(
            dirPath,
            render(dir, view)
        );

        if ('string' === typeof templateConfig) {
            mkdirSync(dirname(templatePath), { recursive: true });
            createFileFromTemplate(
                templatePath,
                templateConfig,
                view
            );
            return;
        }


        mkdirSync(templatePath, { recursive: true });
        renderTemplate(templatePath, templateConfig, view);
    });
}

export const createFileFromTemplate = (filePath: string, template: string, view: Object, encoding = 'utf8') => {
    const parentDir = dirname(filePath);
    if (!existsSync(parentDir)) {
        throw new Error('Unable to create file "' + filePath + '", directory "' + parentDir + '" does not exist');
    }

    writeFileSync(
        filePath,
        render(template, view),
        encoding
    );
}