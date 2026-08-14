import { beforeEach, describe, expect, it, vi } from "vitest";

import container from "../../../../container";
import Github from "./Github";

describe("github", () => {
	let github: Github;

	beforeEach(() => {
		container.snapshot();
		github = container.get(Github);
	});

	describe("validateGitRemote", () => {
		it("should retrieve parsed url data when given url is a valid github url", () => {
			const url = "git@github.com:test/test.git";

			const parsedUrl = github.validateGitRemote(url);

			expect(parsedUrl).toMatchObject({
				auth: null,
				branch: "master",
				filepath: null,
				hash: null,
				host: "github.com",
				hostname: null,
				href: "git@github.com:test/test.git",
				name: "test",
				owner: "test",
				path: "git@github.com:test/test.git",
				pathname: "git@github.com:test/test.git",
				port: null,
				protocol: null,
				query: null,
				repo: "test/test",
				repository: "test/test",
				search: null,
				slashes: null,
			});
		});

		it("should retrieve an error message when a given url is not a valid github url", () => {
			const url = "";

			const parsedUrl = github.validateGitRemote(url);

			expect(parsedUrl).toEqual('Could not parse Git remote from given url ""');
		});

		it("should reject non-github hosts", () => {
			expect(github.validateGitRemote("git@gitlab.com:test/test.git")).toBe(
				'Git remote url "git@gitlab.com:test/test.git" is not a Github url',
			);
		});
	});

	describe("run", () => {
		it("should update package metadata and continue the standard versioning flow", async () => {
			const gitService = github.gitService;
			const packageManagerService = github.packageManagerService;

			vi.spyOn(gitService, "initializeGit").mockResolvedValue(undefined);
			vi.spyOn(gitService, "getGitRemoteOriginUrl").mockResolvedValue(
				"https://github.com/test/test.git",
			);
			vi.spyOn(packageManagerService, "updatePackageJson").mockResolvedValue(
				undefined,
			);
			vi.spyOn(gitService, "commitFiles").mockResolvedValue(undefined);

			await github.run({ realpath: "/tmp/project" });

			expect(packageManagerService.updatePackageJson).toHaveBeenCalledWith(
				"/tmp/project",
				{
					repository: {
						type: "git",
						url: "git+https://github.com/test/test.git",
					},
				},
			);
			expect(gitService.commitFiles).toHaveBeenCalledWith(
				"/tmp/project",
				"initial commit",
				"feat",
			);
		});
	});
});
