import { green, red, yellow } from "chalk";
import { injectable } from "inversify";

@injectable()
export class ConsoleService {
  info(message: string): void {
    process.stdout.write(`\n${yellow("→ ")}${message}\n`);
  }

  success(message: string): void {
    process.stdout.write(`${green("✓ ") + message}\n`);
  }

  error(error: unknown): void {
    if (typeof error === "string") {
      process.stderr.write(`\n${red(`⚠ ${error}`)}\n`);
      return;
    }
    if (error instanceof Error) {
      process.stderr.write(`\n${red(`⚠ [${error.name}] ${error.message}`)}\n${error.stack}\n`);
      return;
    }

    process.stderr.write(`\n${red(`⚠ `)}${JSON.stringify(error)}\n`);
  }
}
