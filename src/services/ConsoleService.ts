import chalk from "chalk";
import { injectable } from "inversify";

@injectable()
export class ConsoleService {
  info(message: string): void {
    process.stdout.write(`\n${chalk.yellow("→ ")}${message}\n`);
  }

  success(message: string): void {
    process.stdout.write(`${chalk.green("✓ ") + message}\n`);
  }

  error(error: unknown): void {
    if (typeof error === "string") {
      process.stderr.write(`\n${chalk.red(`⚠ ${error}`)}\n`);
      return;
    }
    if (error instanceof Error) {
      process.stderr.write(
        `\n${chalk.red(`⚠ [${error.name}] ${error.message}`)}\n${error.stack}\n`
      );
      return;
    }

    process.stderr.write(`\n${chalk.red(`⚠ `)}${JSON.stringify(error)}\n`);
  }
}
