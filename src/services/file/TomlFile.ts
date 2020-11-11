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

  appendContent(content: string): this {
    return this.appendData(parse(content));
  }

  appendData(data: JsonMap): this {
    const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

    const newData = all([(this.data || {}) as JsonMap, data as JsonMap], {
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
