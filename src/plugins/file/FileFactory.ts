import { FileContentType, fixContentEOL } from '../File';
import { existsSync, realpathSync, statSync, readFileSync } from 'fs';
import { extname } from 'path';
import { ReactComponentFile } from './ReactComponentFile';
import { TypescriptFile } from './TypescriptFile';
import { StdFile } from './StdFile';
export class FileFactory {
    private static fileContentCache: {
        [key: string]: {
            [FileContentType.mtime]: Date;
            [FileContentType.content]: string;
            [FileContentType.lines]: string[] | undefined;
            [FileContentType.data]: Object | undefined;
        };
    } = {};
    static fromFile(file: string, encoding = 'utf8'): StdFile | TypescriptFile | ReactComponentFile {
        if (!existsSync(file)) {
            throw new Error('File "' + file + '" does not exist');
        }
        file = realpathSync(file);
        const mtime = statSync(file).mtime;
        if (!FileFactory.fileContentCache[file]
            || !mtime
            || FileFactory.fileContentCache[file][FileContentType.mtime] < mtime) {
            let fileContent = readFileSync(file, encoding).toString();
            fileContent = fixContentEOL(fileContent);
            FileFactory.fileContentCache[file] = {
                [FileContentType.mtime]: mtime,
                [FileContentType.content]: fileContent,
                [FileContentType.lines]: undefined,
                [FileContentType.data]: undefined,
            };
        }
        const content = FileFactory.fileContentCache[file][FileContentType.content];
        return FileFactory.fromString(content, file, encoding);
    }

    static fromString(content: string, file: string, encoding = 'utf8'): StdFile | TypescriptFile | ReactComponentFile {
        switch (extname(file)) {
            case '.tsx':
                // return new ReactComponentFile(file, encoding, content);
            case '.ts':
                return new TypescriptFile(file, encoding, content);
            default:
                return new StdFile(file, encoding, content);
        }
    }
}
