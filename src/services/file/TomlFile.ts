import { AnyJson, JsonMap, parse, stringify } from "@iarna/toml";
import { all } from "deepmerge";

import { StdFile } from "./StdFile";

export class TomlFile extends StdFile {
  protected declare data?: JsonMap;

  getContent(): string {
    return stringify(this.data || {});
  }

  appendContent(content: string): this {
    return this.appendData(this.parseContentToData(content));
  }

  appendData(data: JsonMap): this {
    const overwriteMerge = (_, sourceArray) => sourceArray;

    const newData = all([(this.data || {}) as JsonMap, data as JsonMap], {
      arrayMerge: overwriteMerge,
    }) as JsonMap;
    return this.setContent(stringify(newData));
  }

  getData(): JsonMap | undefined;
  getData(property: string | undefined): AnyJson | undefined;
  getData(property: string | undefined = undefined): AnyJson | undefined {
    if (!this.data) {
      return this.data;
    }
    return property ? this.data[property] : this.data;
  }

  protected parseContent(content: string): string {
    this.data = this.parseContentToData(super.parseContent(content));
    return stringify(this.data || {});
  }

  protected parseContentToData(content: string): JsonMap {
    try {
      return parse(content);
    } catch (error) {
      throw new Error(
        `An error occurred while parsing file content "${this.file}": ${JSON.stringify(
          error instanceof Error ? error.message : error
        )} => "${content.trim()}"`
      );
    }
  }
}
