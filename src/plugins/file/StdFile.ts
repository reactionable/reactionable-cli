
import { writeFileSync, statSync } from 'fs';
import { diffLines, Change } from 'diff';
import { EOL } from 'os';
import { getRunStartDate, promptOverwriteFileDiff } from '../Cli';
import { fileExistsSync } from '../File';
import { FileFactory } from './FileFactory';

export class StdFile {
    protected content: string = '';
    constructor(
        protected file: string | null = null,
        protected encoding: string = 'utf8',
        content: string = '',
    ) {
        this.setContent(content);
    }

    protected setContent(content: string): this {
        this.content = this.parseContent(content);
        return this;
    }

    protected parseContent(content: string): string {
        return this.fixContentEOL(content);
    }

    protected fixContentEOL(content: string): string {
        return content.replace(/(?:\r\n|\r|\n)/g, "\n");
    }

    protected getContentDiff(content): Change[] {
        return diffLines(content, this.getContent());
    }

    getContent(): string {
        return this.content;
    }

    replaceContent(search: RegExp, replacement: string): this {
        const newContent = this.getContent().replace(search, replacement);
        this.setContent(newContent);
        return this;
    }

    appendContent(content: string, after?: string, onlyIfNotExists = true): this {
        content = this.fixContentEOL(content);
        const fileContent = this.getContent();

        if (onlyIfNotExists) {
            if (fileContent.indexOf(content) !== -1) {
                return this;
            }
        }

        if (!after) {
            this.setContent(fileContent + EOL + content);
            return this;
        }

        const contentLines = content.split(EOL);
        const lines = fileContent.split(EOL);

        let lineNumber = 0;
        for (const line of lines) {
            // Write content after found line 
            if (line === after) {
                lines.splice(lineNumber + 1, 0, ...contentLines);
                this.setContent(lines.join(EOL));
                return this;
            }
            lineNumber++;
        }
        return this;
    };

    async saveFile(file: string | null = null, encoding: string | null = null): Promise<this> {
        if (file === null) {
            if (this.file === null) {
                throw new Error('A file path is mandatory to save file');
            }
            file = this.file;
        }

        let content = this.fixContentEOL(this.getContent());
        encoding = encoding === null ? this.encoding : encoding;

        if (!fileExistsSync(file)) {
            writeFileSync(file, content, encoding);
            return this;
        }

        const stat = statSync(file);

        // If file has been created durreing current process 
        const runStartDate = getRunStartDate();
        if (
            runStartDate
            && stat.birthtime >= runStartDate
        ) {
            writeFileSync(file, content, encoding);
            return this;
        }

        let fileContent = FileFactory.fromFile(file, encoding).getContent();
        const diff = this.getContentDiff(fileContent);
        const overwrite = await promptOverwriteFileDiff(file, diff);

        if (overwrite) {
            writeFileSync(file, content, encoding);
        }
        return this;
    }

}