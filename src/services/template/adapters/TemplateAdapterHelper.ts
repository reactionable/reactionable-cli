import { StringUtils } from "../../StringUtils";

export class TemplateAdapterHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHelpers(): Record<string, (...args: any[]) => unknown> {
    return {
      camelize(str: unknown): unknown {
        if (typeof str !== "string") {
          return str;
        }
        return StringUtils.camelize(str);
      },
      decamelize(str: unknown): unknown {
        if (typeof str !== "string") {
          return str;
        }
        return StringUtils.decamelize(str);
      },
      capitalize(str: unknown): unknown {
        if (typeof str !== "string") {
          return str;
        }
        return StringUtils.capitalize(str);
      },
      decapitalize(str: unknown): unknown {
        if (typeof str !== "string") {
          return str;
        }

        return str.charAt(0).toLowerCase() + str.slice(1);
      },
      hyphenize(str: unknown): unknown {
        if (typeof str !== "string") {
          return str;
        }
        return StringUtils.hyphenize(str);
      },
      block(block: string, defaultValue = ""): unknown {
        const blockValue = this?.blocks ? this.blocks[block] : undefined;

        if (blockValue === null) {
          return "";
        }

        if (blockValue === undefined) {
          return this.render(defaultValue, this);
        }

        return this.render(blockValue, this);
      },
    };
  }
}
