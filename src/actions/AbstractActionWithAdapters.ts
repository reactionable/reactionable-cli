import { inject, type ServiceIdentifier } from "inversify";

import container from "../container";
import { CliService } from "../services/CliService";
import { ConsoleService } from "../services/ConsoleService";
import type { AdapterAction } from "./AdapterAction";
import type { RealpathAction, RealpathActionOptions } from "./RealpathAction";

export type ActionWithAdaptersOptions = RealpathActionOptions;

export abstract class AbstractActionWithAdapters<
	A extends AdapterAction,
	O extends ActionWithAdaptersOptions = ActionWithAdaptersOptions,
> implements RealpathAction<O>
{
	protected abstract name: string;
	protected abstract adapterIdentifier: ServiceIdentifier<A>;

	constructor(
		@inject(ConsoleService) private readonly _consoleService: ConsoleService,
		@inject(CliService) private readonly _cliService: CliService,
	) {}

	get consoleService(): ConsoleService {
		return this._consoleService;
	}

	get cliService(): CliService {
		return this._cliService;
	}

	getName(): string {
		return this.name;
	}

	protected getAdapters(): A[] {
		return container.getAll<A>(this.adapterIdentifier);
	}

	async detectAdapter(realpath: string): Promise<A | null> {
		const adapters = this.getAdapters();

		for (const adapter of adapters) {
			if (await adapter.isEnabled(realpath)) {
				return adapter;
			}
		}
		return null;
	}

	async run(options: ActionWithAdaptersOptions): Promise<void> {
		const name = this.getName();

		this.consoleService.info(`Adding ${name}...`);

		let adapter: A | null = await this.detectAdapter(options.realpath);
		if (adapter) {
			const override = await this.cliService.promptToContinue(
				`"${adapter.getName()}" is already added`,
				"override it?",
			);

			if (!override) {
				return;
			}
		} else {
			const choices = {
				...this.getAdapters().reduce(
					(choice, adapter) => {
						choice[adapter.getName()] = adapter;
						return choice;
					},
					{} as Record<string, A>,
				),
				None: null,
			};

			adapter = await this.cliService.promptToChoose(
				`Wich ${name} do you want to add?`,
				choices,
			);
		}

		if (!adapter) {
			return;
		}

		await adapter.run(options);
	}
}
