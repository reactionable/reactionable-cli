import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { Builtins, Cli as Clipanion, Command } from "clipanion";
import { textSync } from "figlet";
import prompts from "prompts";

import { NamedAction } from "../actions/NamedAction";
import container from "../container";
import { CliService } from "../services/CliService";
import { ConsoleService } from "../services/ConsoleService";
import { PackageManagerService } from "../services/package-manager/PackageManagerService";
import { ActionIdentifier } from "../actions/container";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// run [-v,--verbose] [--name ARG]
class RunCommand extends Command {
  static paths = [[`run`]];
  //   @Command.Boolean(`-v,--verbose`)
  //   public verbose = false;

  //   @Command.String(`--name`)
  //   public name?: string;

  async execute() {
    try {
      container.get(CliService).initRunStartDate();

      const { action } = await prompts([
        {
          name: "action",
          message: "What do you want to do?",
          type: "select",
          choices: [
            ...container.getAll<NamedAction>(ActionIdentifier).map((action) => ({
              title: action.getName(),
              value: action,
            })),
          ],
        },
      ]);

      const { projectDir } = await prompts([
        {
          type: "text",
          name: "projectDir",
          message: `Where to you you want to ${action.getName().toLowerCase()} (path)?`,
          initial: process.cwd(),
          format: (input) => resolve(input),
        },
      ]);

      const realpath = resolve(projectDir);

      // Execute action
      await action.run({ realpath });
    } catch (err) {
      container.get(ConsoleService).error(err);
    }
  }
}

export class Cli {
  protected cli?: Clipanion;

  protected async initialize(): Promise<void> {
    this.cli = new Clipanion({
      binaryLabel: this.getBinaryLabel(),
      binaryName: `reactionable`,
      binaryVersion: await this.getBinaryVersion(),
      enableColors: true,
    });
    this.cli.register(Builtins.HelpCommand);
    this.cli.register(Builtins.VersionCommand);
    this.cli.register(RunCommand);
  }

  protected getBinaryLabel(): string {
    return `\n${textSync("Reactionable", {
      font: "Small Slant",
      horizontalLayout: "default",
      verticalLayout: "default",
    })}`;
  }

  protected getBinaryVersion(): Promise<string | undefined> {
    return container.get(PackageManagerService).getPackageVersion(resolve(__dirname, "../.."));
  }

  async run(): Promise<void> {
    await this.initialize();
    this.cli?.runExit(process.argv.slice(2), {
      ...Clipanion.defaultContext,
    });
  }
}
