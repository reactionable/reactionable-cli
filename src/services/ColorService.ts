import { injectable } from "inversify";
import { gray, green, greenBright, red, redBright, yellow } from "colorette";

@injectable()
export class ColorService {
  green(value: string) {
    return green(value);
  }

  yellow(value: string) {
    return yellow(value);
  }

  gray(value: string): string {
    return gray(value);
  }

  red(value: string) {
    return red(value);
  }

  redBright(value: string): string {
    return redBright(value);
  }

  greenBright(value: string): string {
    return greenBright(value);
  }
}
