import prompts from "prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AbstractVersioning from "./AbstractVersioning";

vi.mock("prompts", () => ({
	default: vi.fn(),
}));

describe("AbstractVersioning", () => {
	const consoleService = {
		info: vi.fn(),
	};
	const packageManagerService = {
		updatePackageJson: vi.fn(),
	};
	const gitService = {
		isAGitRepository: vi.fn(),
		initializeGit: vi.fn(),
		getGitRemoteOriginUrl: vi.fn(),
		execGitCmd: vi.fn(),
		parseGitRemoteUrl: vi.fn(),
		commitFiles: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should prompt for a remote URL and add it when the repository has no origin", async () => {
		class TestVersioning extends AbstractVersioning {
			protected name = "Test versioning";
		}

		const action = new TestVersioning(
			consoleService as any,
			packageManagerService as any,
			gitService as any,
		);

		gitService.isAGitRepository.mockResolvedValue(true);
		gitService.getGitRemoteOriginUrl.mockResolvedValue(null);
		vi.mocked(prompts).mockResolvedValue({
			remoteOriginUrl: "git@github.com:test/test.git",
		});
		gitService.parseGitRemoteUrl.mockReturnValue({
			host: "github.com",
			repo: "test/test",
			owner: "test",
		});
		packageManagerService.updatePackageJson.mockResolvedValue(undefined);
		gitService.commitFiles.mockResolvedValue(undefined);

		await action.run({ realpath: "/tmp/project" });

		expect(gitService.initializeGit).toHaveBeenCalledWith("/tmp/project");
		expect(gitService.execGitCmd).toHaveBeenCalledWith(
			["remote", "add", "origin", "git@github.com:test/test.git"],
			"/tmp/project",
		);
		expect(packageManagerService.updatePackageJson).toHaveBeenCalledWith(
			"/tmp/project",
			{
				repository: {
					type: "git",
					url: "git+null",
				},
			},
		);
	});

	it("should validate git remote URLs and reject invalid values", () => {
		class TestVersioning extends AbstractVersioning {
			protected name = "Test versioning";
		}

		const action = new TestVersioning(
			consoleService as any,
			packageManagerService as any,
			gitService as any,
		);

		gitService.parseGitRemoteUrl.mockReturnValue(null);
		expect(action.validateGitRemote("bad-url")).toBe(
			'Could not parse Git remote from given url "bad-url"',
		);
	});
});
