import { fileExistsSync } from '../File';
import { realpathSync, statSync, readFileSync } from 'fs';
import { extname } from 'path';
import { ReactComponentFile } from './ReactComponentFile';
import { TypescriptFile } from './TypescriptFile';
import { StdFile } from './StdFile';
import { TomlFile } from './TomlFile';
import { JsonFile } from './JsonFile';

export enum FileContentType {
    mtime,
    content,
    lines,
}

export class FileFactory {

    private static fileContentCache: {
        [key: string]: {
            [FileContentType.mtime]: Date;
            [FileContentType.content]: string;
        };
    } = {};

    static fromFile<File extends StdFile = StdFile>(file: string, encoding = 'utf8'): File {
        if (!fileExistsSync(file)) {
            throw new Error('File "' + file + '" does not exist');
        }
        file = realpathSync(file);

        const stat = statSync(file);
        const realMtime = new Date(Math.max.apply(null, [
            stat.birthtime.getTime(),
            stat.mtime.getTime(),
        ]));

        if (!FileFactory.fileContentCache[file]
            || !realMtime
            || FileFactory.fileContentCache[file][FileContentType.mtime] < realMtime) {
            let fileContent = readFileSync(file, encoding).toString();
            FileFactory.fileContentCache[file] = {
                [FileContentType.mtime]: realMtime,
                [FileContentType.content]: fileContent,
            };
        }
        const content = FileFactory.fileContentCache[file][FileContentType.content];
        try {
            return FileFactory.fromString(content, file, encoding) as File;
        } catch (error) {
            throw new Error(`An error occurred while parsing file "${file}": ${JSON.stringify(error)}`);
        }
    }

    static fromString(content: string, file: string, encoding = 'utf8'): StdFile {
        switch (extname(file)) {
            case '.json':
                return new JsonFile(file, encoding, content);
            case '.toml':
                return new TomlFile(file, encoding, content);
            case '.tsx':
            // return new ReactComponentFile(file, encoding, content);
            case '.ts':
                return new TypescriptFile(file, encoding, content);
            default:
                return new StdFile(file, encoding, content);
        }
    }
}
