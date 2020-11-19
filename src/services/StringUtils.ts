export type StringUtilsMethod = (value: string) => string;

export type StringUtilsMethods = keyof typeof StringUtils;

export class StringUtils {
  static capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  static capitalizeWords(value: string): string {
    return value.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  static hyphenize(value: string): string {
    return StringUtils.camelize(value)
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  static camelize(value: string): string {
    return (value[0].toLowerCase() + value.substring(1)).replace(/\W+(.)/g, (match, chr) =>
      chr.toUpperCase()
    );
  }

  static decamelize(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }
}
