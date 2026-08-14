import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import prompts from "prompts";
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import container from "../../container";
import { GitService } from "./GitService";

vi.mock("prompts", () => ({
	default: vi.fn(),
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("gitService", () => {
	let service: GitService;
	let testDir: { removeCallback: () => void } | undefined;
	let cliService: {
		execCmd: ReturnType<typeof vi.fn>;
	};
	let consoleService: {
		info: ReturnType<typeof vi.fn>;
		success: ReturnType<typeof vi.fn>;
	};
	let packageManagerService: {
		isMonorepoPackage: ReturnType<typeof vi.fn>;
		getPackageName: ReturnType<typeof vi.fn>;
	};

	beforeAll(() => {
		service = container.get(GitService);
	});

	beforeEach(() => {
		cliService = {
			execCmd: vi.fn(),
		};
		consoleService = {
			info: vi.fn(),
			success: vi.fn(),
		};
		packageManagerService = {
			isMonorepoPackage: vi.fn(),
			getPackageName: vi.fn(),
		};
		service = new GitService(
			cliService as any,
			consoleService as any,
			packageManagerService as any,
		);
		vi.mocked(prompts).mockReset();
	});

	afterEach(() => {
		testDir?.removeCallback();
	});

	describe("isAGitRepository", () => {
		it("should return true when the given directory path is a git repository", async () => {
			cliService.execCmd.mockResolvedValue("true");

			const result = await service.isAGitRepository(__dirname);
			expect(result).toEqual(true);
		});

		it("should return false when the given directory path is not a git repository", async () => {
			cliService.execCmd.mockResolvedValue("false");

			const result = await service.isAGitRepository("/tmp/not-a-repo");
			expect(result).toEqual(false);
		});

		it("should return false when git reports that the directory is not a repository", async () => {
			cliService.execCmd.mockRejectedValue(
				new Error("fatal: not a git repository"),
			);

			await expect(service.isAGitRepository("/tmp/not-a-repo")).resolves.toBe(
				false,
			);
		});

		it("should rethrow unexpected git errors", async () => {
			const error = new Error("fatal: permission denied");
			cliService.execCmd.mockRejectedValue(error);

			await expect(service.isAGitRepository("/tmp/bad-dir")).rejects.toThrow(
				"fatal: permission denied",
			);
		});
	});

	describe("initializeGit", () => {
		it("should noop when the directory is already a git repository", async () => {
			cliService.execCmd.mockResolvedValue("true");

			await service.initializeGit("/tmp/project");

			expect(consoleService.info).not.toHaveBeenCalled();
			expect(cliService.execCmd).toHaveBeenCalledTimes(1);
		});

		it("should initialize git in a non-repository directory", async () => {
			cliService.execCmd
				.mockResolvedValueOnce("false")
				.mockResolvedValueOnce("");

			await service.initializeGit("/tmp/project");

			expect(consoleService.info).toHaveBeenCalledWith("Initilize Git...");
			expect(cliService.execCmd).toHaveBeenNthCalledWith(
				1,
				["git", "rev-parse --is-inside-work-tree"],
				"/tmp/project",
				true,
			);
			expect(cliService.execCmd).toHaveBeenNthCalledWith(
				2,
				["git", "init"],
				"/tmp/project",
				undefined,
			);
			expect(consoleService.success).toHaveBeenCalledWith(
				'Git has been initialized in "/tmp/project"',
			);
		});
	});

	describe("getGitCurrentBranch", () => {
		it("should fallback to the default branch when git returns no branch", async () => {
			cliService.execCmd.mockResolvedValue("");

			await expect(
				service.getGitCurrentBranch("/tmp/project", "main"),
			).resolves.toEqual("main");
		});
	});

	describe("getGitRemoteOriginUrl", () => {
		it("should return the raw git remote URL when not parsed", async () => {
			cliService.execCmd.mockResolvedValue(
				"remote.origin.url=https://github.com/test-owner/test-repo.git",
			);

			await expect(
				service.getGitRemoteOriginUrl("/tmp/project", false),
			).resolves.toEqual("https://github.com/test-owner/test-repo.git");
		});

		it("should parse the git remote URL when requested", async () => {
			cliService.execCmd.mockResolvedValue(
				"remote.origin.url=https://github.com/test-owner/test-repo.git",
			);

			await expect(
				service.getGitRemoteOriginUrl("/tmp/project", true),
			).resolves.toMatchObject({
				owner: "test-owner",
				name: "test-repo",
			});
		});
	});

	describe("commitFiles", () => {
		it("should skip the commit when the working tree is already clean", async () => {
			cliService.execCmd.mockResolvedValue("");

			await service.commitFiles("/tmp/project", "initial commit", "feat");

			expect(consoleService.info).not.toHaveBeenCalled();
			expect(cliService.execCmd).toHaveBeenCalledTimes(1);
		});

		it("should commit repo changes using the default monorepo message", async () => {
			cliService.execCmd
				.mockResolvedValueOnce(" M src/index.ts")
				.mockResolvedValueOnce("")
				.mockResolvedValueOnce("")
				.mockResolvedValueOnce("");
			packageManagerService.isMonorepoPackage.mockResolvedValue(true);
			packageManagerService.getPackageName.mockResolvedValue("test-package");
			vi.mocked(prompts).mockResolvedValue({ commitMessage: "custom commit" });

			await service.commitFiles("/tmp/project", "initial commit", "feat");

			expect(packageManagerService.getPackageName).toHaveBeenCalledWith(
				"/tmp/project",
				"hyphenize",
				false,
			);
			expect(cliService.execCmd).toHaveBeenCalledWith(
				["git", "commit", "-am", '"custom commit"'],
				"/tmp/project",
				undefined,
			);
			expect(consoleService.success).toHaveBeenCalledWith(
				"Files have been commited",
			);
		});
	});
});
