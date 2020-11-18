import { all } from 'deepmerge';

import { StdFile } from './StdFile';

type JsonArray = boolean[] | number[] | string[] | JsonFileData[] | Date[];
type AnyJson = boolean | number | string | JsonFileData | Date | JsonArray | JsonArray[];

export interface JsonFileData {
  [key: string]: AnyJson | undefined;
}

export class JsonFile extends StdFile {
  protected data?: JsonFileData;

  getContent(): string {
    return JSON.stringify(this.data, null, '  ');
  }

  appendContent(content: string): this {
    return this.appendData(JSON.parse(content));
  }

  appendData(data: JsonFileData): this {
    const newData = all([(this.data || {}) as JsonFileData, data]);
    return this.setContent(JSON.stringify(newData, null, '  '));
  }

  getData<D extends JsonFileData = JsonFileData>(): D | undefined;
  getData<D extends JsonFileData = JsonFileData, P extends keyof D = keyof D>(
    property: P
  ): D[P] | undefined;
  getData<D extends JsonFileData = JsonFileData, P extends keyof D = keyof D>(
    property: P | undefined = undefined
  ): D | D[P] | undefined {
    if (!this.data) {
      return this.data;
    }

    const data = (this.data as unknown) as D;
    if (!property) {
      return data;
    }

    return data[property];
  }

  protected parseContent(content: string): string {
    content = super.parseContent(content);
    try {
      this.data = JSON.parse(content);
    } catch (error) {
      throw new Error(
        `An error occurred while parsing file content "${this.file}": ${JSON.stringify(
          error.message
        )} => "${content.trim()}"`
      );
    }
    return content;
  }
}
