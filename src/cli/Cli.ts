import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Builtins, Cli as Clipanion, Command } from "clipanion";
import figlet from "figlet";
import prompts from "prompts";
import { ActionIdentifier } from "../actions/container.js";
import type { NamedAction } from "../actions/NamedAction.js";
import container from "../container.js";
import { CliService } from "../services/CliService.js";
import { ConsoleService } from "../services/ConsoleService.js";

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
						...container
							.getAll<NamedAction>(ActionIdentifier)
							.map((action) => ({
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
		return `\n${figlet.textSync("Reactionable", {
			font: "Small Slant",
			horizontalLayout: "default",
			verticalLayout: "default",
		})}`;
	}

	protected async getBinaryVersion(): Promise<string> {
		const manifest = await readFile(
			new URL("../../package.json", import.meta.url),
			"utf8",
		);
		return JSON.parse(manifest).version;
	}

	async run(): Promise<void> {
		await this.initialize();
		this.cli?.runExit(process.argv.slice(2), {
			...Clipanion.defaultContext,
		});
	}
}
