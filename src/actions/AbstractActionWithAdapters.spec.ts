import { describe, expect, it, vi } from "vitest";

vi.mock("../container", () => ({
	default: {
		getAll: vi.fn(),
	},
}));

import {
	AbstractActionWithAdapters,
	type ActionWithAdaptersOptions,
} from "./AbstractActionWithAdapters";
import { AbstractAdapterWithPackageAction } from "./AbstractAdapterWithPackageAction";
import { AbstractCommitableActionWithAdapters } from "./AbstractCommitableActionWithAdapters";
import type { AdapterAction } from "./AdapterAction";

describe("AbstractActionWithAdapters", () => {
	class TestAdapter implements AdapterAction {
		constructor(
			public readonly name: string,
			public readonly onRun: () => Promise<void> = async () => {},
			private readonly enabled: boolean = true,
		) {}

		async isEnabled(): Promise<boolean> {
			return this.enabled;
		}

		getName(): string {
			return this.name;
		}

		async run(): Promise<void> {
			await this.onRun();
		}
	}

	class TestAction extends AbstractActionWithAdapters<TestAdapter> {
		protected name = "Test action";
		protected adapterIdentifier = Symbol("TestActionAdapter");

		constructor(
			private readonly adapters: TestAdapter[],
			consoleService: any,
			cliService: any,
		) {
			super(consoleService, cliService);
		}

		protected override getAdapters(): TestAdapter[] {
			return this.adapters;
		}
	}

	it("should detect enabled adapters", async () => {
		const adapter = new TestAdapter("Enabled adapter");
		const action = new TestAction(
			[adapter],
			{ info: vi.fn() },
			{ promptToContinue: vi.fn(), promptToChoose: vi.fn() },
		);

		await expect(action.detectAdapter("/tmp/project")).resolves.toBe(adapter);
	});

	it("should stop when the current adapter is already installed and user declines override", async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const adapter = new TestAdapter("Existing adapter", run, true);
		const consoleService = { info: vi.fn() };
		const cliService = {
			promptToContinue: vi.fn().mockResolvedValue(false),
			promptToChoose: vi.fn(),
		};
		const action = new TestAction([adapter], consoleService, cliService);

		await action.run({ realpath: "/tmp/project" });

		expect(cliService.promptToContinue).toHaveBeenCalledWith(
			'"Existing adapter" is already added',
			"override it?",
		);
		expect(run).not.toHaveBeenCalled();
	});

	it("should prompt for a choice and run the selected adapter when no adapter is enabled", async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const adapter = new TestAdapter("Selected adapter", run, false);
		const action = new TestAction(
			[adapter],
			{ info: vi.fn() },
			{
				promptToContinue: vi.fn(),
				promptToChoose: vi.fn().mockResolvedValue(adapter),
			},
		);

		await action.run({ realpath: "/tmp/project" });

		expect(run).toHaveBeenCalledTimes(1);
	});

	it("should return without selecting an adapter when the user cancels the prompt", async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const adapter = new TestAdapter("Cancelled adapter", run, false);
		const action = new TestAction(
			[adapter],
			{ info: vi.fn() },
			{
				promptToContinue: vi.fn(),
				promptToChoose: vi.fn().mockResolvedValue(null),
			},
		);

		await action.run({ realpath: "/tmp/project" });

		expect(run).not.toHaveBeenCalled();
	});
});

describe("AbstractCommitableActionWithAdapters", () => {
	class TestAdapter implements AdapterAction {
		constructor(
			public readonly name: string,
			private readonly enabled: boolean,
			public readonly onRun: () => Promise<void> = async () => {},
		) {}

		async isEnabled(): Promise<boolean> {
			return this.enabled;
		}

		getName(): string {
			return this.name;
		}

		async run(): Promise<void> {
			await this.onRun();
		}
	}

	class TestCommitableAction extends AbstractCommitableActionWithAdapters<TestAdapter> {
		protected name = "Test commitable action";
		protected adapterIdentifier = Symbol("TestCommitableAdapter");

		constructor(
			private readonly adapters: TestAdapter[],
			gitService: any,
			consoleService: any,
			cliService: any,
		) {
			super(gitService, consoleService, cliService);
		}

		protected override getAdapters(): TestAdapter[] {
			return this.adapters;
		}
	}

	it("should commit files after a successful adapter run", async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const adapter = new TestAdapter("Git adapter", true, run);
		const gitService = {
			isAGitRepository: vi.fn().mockResolvedValue(true),
			commitFiles: vi.fn().mockResolvedValue(undefined),
		};
		const consoleService = { info: vi.fn(), success: vi.fn() };
		const cliService = { promptToContinue: vi.fn(), promptToChoose: vi.fn() };
		const action = new TestCommitableAction(
			[adapter],
			gitService,
			consoleService,
			cliService,
		);

		await action.run({ realpath: "/tmp/project" });

		expect(gitService.commitFiles).toHaveBeenCalledWith(
			"/tmp/project",
			'adding Test commitable action "Git adapter"',
			"feat",
		);
	});

	it("should skip git commit when the target directory is not a repository", async () => {
		const run = vi.fn().mockResolvedValue(undefined);
		const adapter = new TestAdapter("Git adapter", true, run);
		const gitService = {
			isAGitRepository: vi.fn().mockResolvedValue(false),
			commitFiles: vi.fn().mockResolvedValue(undefined),
		};
		const action = new TestCommitableAction(
			[adapter],
			gitService,
			{ info: vi.fn(), success: vi.fn() },
			{ promptToContinue: vi.fn(), promptToChoose: vi.fn() },
		);

		await action.run({ realpath: "/tmp/project" });

		expect(gitService.commitFiles).not.toHaveBeenCalled();
	});
});

describe("AbstractAdapterWithPackageAction", () => {
	class TestAdapter extends AbstractAdapterWithPackageAction {
		protected name = "Test package adapter";
		protected adapterPackageName = "@test/package";

		async isEnabled(realpath: string): Promise<boolean> {
			return this.packageManagerService.hasInstalledPackage(
				realpath,
				this.getAdapterPackageName(),
			);
		}
	}

	it("should report whether the adapter package is installed", async () => {
		const packageManagerService = {
			hasInstalledPackage: vi.fn().mockResolvedValue(true),
			installPackages: vi.fn().mockResolvedValue(["@test/package"]),
		};
		const adapter = new TestAdapter(packageManagerService);

		await expect(adapter.isEnabled("/tmp/project")).resolves.toBe(true);
		expect(packageManagerService.hasInstalledPackage).toHaveBeenCalledWith(
			"/tmp/project",
			"@test/package",
		);
	});

	it("should install the adapter package when run", async () => {
		const packageManagerService = {
			hasInstalledPackage: vi.fn().mockResolvedValue(false),
			installPackages: vi.fn().mockResolvedValue(["@test/package"]),
		};
		const adapter = new TestAdapter(packageManagerService);

		await adapter.run({
			realpath: "/tmp/project",
		} satisfies ActionWithAdaptersOptions);

		expect(packageManagerService.installPackages).toHaveBeenCalledWith(
			"/tmp/project",
			["@test/package"],
		);
	});
});
