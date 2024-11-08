import { inject } from "inversify";
import { ColorService } from "./ColorService";

export class ConsoleService {
  constructor(@inject(ColorService) private readonly colorService: ColorService) {}

  info(message: string): void {
    process.stdout.write(`\n${this.colorService.yellow("→ ")}${message}\n`);
  }

  success(message: string): void {
    process.stdout.write(`${this.colorService.green("✓ ") + message}\n`);
  }

  error(error: unknown): void {
    if (typeof error === "string") {
      process.stderr.write(`\n${this.colorService.red(`⚠ ${error}`)}\n`);
      return;
    }
    if (error instanceof Error) {
      process.stderr.write(
        `\n${this.colorService.red(`⚠ [${error.name}] ${error.message}`)}\n${error.stack}\n`
      );
      return;
    }

    process.stderr.write(`\n${this.colorService.red(`⚠ `)}${JSON.stringify(error)}\n`);
  }
}
