import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join, basename, extname, sep } from 'path';
import { plural } from 'pluralize';
import { compile, registerHelper, SafeString, registerPartial, partials } from 'handlebars';
import { safeWriteFile } from './File';

// Compile template
registerHelper({
    and: (...parts) => {
        return Array.prototype.slice.call(parts, 0, parts.length - 1).every(Boolean);
    },
    eq: (v1, v2) => {
        return v1 === v2;
    },
    neq: (v1, v2) => {
        return v1 !== v2;
    },
    lt: (v1, v2) => {
        return v1 < v2;
    },
    gt: (v1, v2) => {
        return v1 > v2;
    },
    capitalize: (str) => {
        if ('string' !== typeof str) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    pluralize: (str) => {
        if ('string' !== typeof str) {
            return str;
        }
        return plural(str);
    },
    halfSplit: (array) => {
        if (!Array.isArray(array)) {
            return array;
        }
        // Split ranks steps in two parts
        const tmpArray = array;
        const halfWayThough = Math.floor(array.length / 2);
        return [
            tmpArray.slice(0, halfWayThough),
            tmpArray.slice(halfWayThough, tmpArray.length),
        ];
    },
    inline(options) {
        const inline = compile(options.fn(this))(options.data.root);
        const nl2br = inline.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        return new SafeString(nl2br);
    },
    with(context, options) {
        return options.fn(context);
    },
});

export type TemplateConfig = string[] | {
    [key: string]: TemplateConfig | string;
};

export const renderTemplateTree = async (dirPath: string, namespace: string, config: TemplateConfig, context: Object = {}): Promise<void> => {
    if (!existsSync(dirPath)) {
        throw new Error('Directory "' + dirPath + '" does not exist');
    }

    if (Array.isArray(config)) {
        for (const filePath of config) {
            await createFileFromTemplate(
                join(dirPath, filePath),
                namespace,
                context
            );
        }
        return;
    }

    for (const dir of Object.keys(config)) {
        const templateConfig = config[dir];
        const currentPath = resolve(
            dirPath,
            await renderTemplateString(dir, context)
        );

        if ('string' === typeof templateConfig) {
            await createFileFromTemplate(
                currentPath,
                join(namespace, templateConfig),
                context
            );
        }
        else {
            mkdirSync(currentPath, { recursive: true });
            await renderTemplateTree(currentPath, namespace, templateConfig, context);
        }
    }
}

const createFileFromTemplate = async (filePath: string, namespace: string, context: Object, encoding = 'utf8') => {
    const parentDir = dirname(filePath);
    if (!existsSync(parentDir)) {
        throw new Error('Unable to create file "' + filePath + '", directory "' + parentDir + '" does not exist');
    }

    const templateKey = extname(namespace) ? namespace : join(namespace, basename(filePath));
    const fileContent = await renderTemplateFile(templateKey, context);
    await safeWriteFile(filePath, fileContent, encoding);
};

const getTemplateFileContent = async (template: string): Promise<string> => {
    const templatePath = join('./../templates', template + '.template');
    const templateContent = (await import(templatePath)).default;

    // Register partials if any
    const regex = /\{\{#> ([a-zA-Z]+) \}\}/img;
    let matches;
    while ((matches = regex.exec(templateContent)) !== null) {
        if (matches.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        const partialName: string = matches[1];

        if (partials[partialName]) {
            continue;
        }

        const partialTemplateKey = template.split(sep)[0] + '/partials/' + partialName;
        const partialTmplateContent = await getTemplateFileContent(partialTemplateKey);

        registerPartial(
            partialName,
            partialTmplateContent
        );
    }

    return templateContent;
}

type CompiledTemplate = (context: Object) => string;
const compiledTemplates: { [key: string]: CompiledTemplate } = {};

const getCompiledTemplateString = async (templateKey: string, templateContent: string): Promise<CompiledTemplate> => {
    if (compiledTemplates[templateKey]) {
        return compiledTemplates[templateKey];
    }
    return compiledTemplates[templateKey] = compile(templateContent);
}

const renderTemplateString = async (template: string, context: Object): Promise<string> => {
    const compiledTemplate = await getCompiledTemplateString(template, template);
    return compiledTemplate(context);
}

const getCompiledTemplateFile = async (templateKey: string): Promise<CompiledTemplate> => {
    if (compiledTemplates[templateKey]) {
        return compiledTemplates[templateKey];
    }
    return compiledTemplates[templateKey] = compile(await getTemplateFileContent(templateKey));
}

const renderTemplateFile = async (templateKey: string, context: Object): Promise<string> => {
    const compiledTemplate = await getCompiledTemplateFile(templateKey);
    return compiledTemplate(context);
}