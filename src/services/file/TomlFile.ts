import { AnyJson, JsonMap, parse, stringify } from '@iarna/toml';
import { all } from 'deepmerge';

import { StdFile } from './StdFile';

export class TomlFile extends StdFile {
  protected data?: JsonMap;

  protected parseContent(content: string): string {
    content = super.parseContent(content);
    this.data = parse(content);
    return content;
  }

  getContent(): string {
    return stringify(this.data || {});
  }

  appendContent(content: string, after?: string, onlyIfNotExists = true): this {
    return this.appendData(parse(content));
  }

  appendData(data: JsonMap) {
    const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

    const newData = all([(this.data || {}) as object, data as object], {
      arrayMerge: overwriteMerge,
    }) as JsonMap;
    return this.setContent(stringify(newData));
  }

  getData(property?: undefined): JsonMap | undefined;
  getData(property?: string): AnyJson | undefined {
    if (!this.data) {
      return this.data;
    }
    return property ? this.data[property] : this.data;
  }
}
