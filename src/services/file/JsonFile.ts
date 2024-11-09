import { all } from "deepmerge";

import { StdFile } from "./StdFile";

type JsonArray = boolean[] | number[] | string[] | JsonFileData[] | Date[];
type AnyJson = boolean | number | string | JsonFileData | Date | JsonArray | JsonArray[];

export interface JsonFileData {
  [key: string]: AnyJson | undefined;
}

export class JsonFile extends StdFile {
  protected declare data?: JsonFileData;

  appendContent(content: string): this {
    return this.appendData(this.parseContentToData(content));
  }

  appendData(data: JsonFileData): this {
    const newData = all([(this.data || {}) as JsonFileData, data]);
    return this.setContent(JSON.stringify(newData, null, "  "));
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

    const data = this.data as unknown as D;
    if (!property) {
      return data;
    }

    return data[property];
  }

  protected parseContent(content: string): string {
    this.data = this.parseContentToData(super.parseContent(content));
    return JSON.stringify(this.data, null, "  ");
  }

  protected parseContentToData(content: string): JsonFileData {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(
        `An error occurred while parsing file content "${this.file}": ${JSON.stringify(
          error instanceof Error ? error.message : error
        )} => "${content.trim()}"`
      );
    }
  }
}
