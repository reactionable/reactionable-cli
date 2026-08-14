import prompts from "prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GenerateReadme from "./GenerateReadme";

vi.mock("prompts", () => ({
	default: vi.fn(),
}));

describe("GenerateReadme", () => {
	const cliService = {
		getGlobalCmd: vi.fn(),
		execCmd: vi.fn(),
	};
	const consoleService = {
		info: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
	};
	const gitService = {
		isAGitRepository: vi.fn(),
		commitFiles: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should abort when the prompt is declined", async () => {
		vi.mocked(prompts).mockResolvedValue({ override: false });
		const action = new GenerateReadme(
			cliService as any,
			consoleService as any,
			gitService as any,
		);

		await action.run({ realpath: "/tmp/project", mustPrompt: true });

		expect(consoleService.info).toHaveBeenCalledWith(
			"Generating README.md file...",
		);
		expect(cliService.getGlobalCmd).not.toHaveBeenCalled();
	});

	it("should return without generating when no README generator is installed", async () => {
		cliService.getGlobalCmd.mockReturnValue(null);
		const action = new GenerateReadme(
			cliService as any,
			consoleService as any,
			gitService as any,
		);

		await action.run({ realpath: "/tmp/project" });

		expect(consoleService.error).toHaveBeenCalledWith(
			'Unable to generate README.md file, install globally "readme-md-generator" or "npx"',
		);
		expect(cliService.execCmd).not.toHaveBeenCalled();
	});

	it("should generate the README and commit it when the project is a git repository", async () => {
		cliService.getGlobalCmd.mockReturnValue("npx readme-md-generator");
		gitService.isAGitRepository.mockResolvedValue(true);
		const action = new GenerateReadme(
			cliService as any,
			consoleService as any,
			gitService as any,
		);

		await action.run({ realpath: "/tmp/project" });

		expect(cliService.execCmd).toHaveBeenCalledWith(
			["npx readme-md-generator", "-y"],
			"/tmp/project",
		);
		expect(consoleService.success).toHaveBeenCalledWith(
			'README.md file has been generated in "/tmp/project"',
		);
		expect(gitService.commitFiles).toHaveBeenCalledWith(
			"/tmp/project",
			"generate README.md file",
			"chore",
		);
	});
});
