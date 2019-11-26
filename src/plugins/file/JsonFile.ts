import { StdFile } from './StdFile';
import { all } from 'deepmerge';

export class JsonFile extends StdFile {

    protected data?: object;

    protected parseContent(content: string): string {
        content = super.parseContent(content);
        try {
            this.data = JSON.parse(content);
        }
        catch (error) {
            throw new Error(`An error occurred while parsing file content "${this.file}": ${JSON.stringify(error)} => "${content.trim()}"`);
        }
        return content;
    }

    getContent(): string {
        return JSON.stringify(this.data, null, '  ');
    }

    appendContent(content: string, after?: string, onlyIfNotExists = true): this {
        return this.appendData(JSON.parse(content));
    }

    appendData(data: object): this {
        const newData = all([
            (this.data || {}) as object,
            data,
        ]);
        return this.setContent(JSON.stringify(newData, null, '  '));
    }    

    getData<D = any>(property?: string): D | undefined {
        if (!this.data) {
            return this.data;
        }
        return property ? this.data[property] : this.data;
    }
}