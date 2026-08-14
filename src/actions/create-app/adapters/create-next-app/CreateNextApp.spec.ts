import { dirname, join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("child_process");

import prompts from "prompts";

import container from "../../../../container";
import { mockYarnCmd, restoreMockCmd } from "../../../../tests/mock-cmd";
import {
	mockDir,
	mockDirPath,
	mockYarnDir,
	restoreMockFs,
} from "../../../../tests/mock-fs";
import CreateNextApp from "./CreateNextApp";

describe("CreateNextApp", () => {
	let createNextApp: CreateNextApp;

	beforeAll(() => {
		createNextApp = container.get(CreateNextApp);
	});

	afterEach(() => {
		restoreMockFs();
		restoreMockCmd();
	});

	afterAll(() => {
		vi.restoreAllMocks();
	});

	describe("checkIfAppExistsAlready", () => {
		it("should return false if the given realpath is not an existing directory", async () => {
			mockDir();

			const result = await createNextApp.checkIfAppExistsAlready(
				join(mockDirPath, "app"),
			);
			expect(result).toEqual(false);
		});

		it("should return undefined if user do not want overriding existing directory", async () => {
			mockDir();

			prompts.inject([false]);
			const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toBeUndefined();
		});

		it("should return false if directory exists but do not have expected files", async () => {
			mockDir();

			prompts.inject([true]);

			const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toEqual(false);
		});

		it("should return true if directory exists and have expected files", async () => {
			mockYarnCmd();
			mockYarnDir({
				"package.json": JSON.stringify({
					dependencies: {
						next: "1.0.0",
					},
				}),
			});

			prompts.inject([true]);

			const result = await createNextApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toEqual(true);
		});
	});

	describe("createApp and Sass paths", () => {
		it("should create the app, install base dependencies, and trigger the Next component generation", async () => {
			Object.defineProperty(createNextApp, "cliService", {
				value: {
					getGlobalCmd: vi.fn().mockReturnValue("npx create-next-app"),
					execCmd: vi.fn().mockResolvedValue("ok"),
					promptToChoose: vi.fn().mockResolvedValue("npm"),
				},
				configurable: true,
			});
			Object.defineProperty(createNextApp, "packageManagerService", {
				value: {
					getAvailablePackageManagers: vi.fn().mockReturnValue(["npm"]),
					installPackages: vi.fn().mockResolvedValue([]),
					uninstallPackages: vi.fn().mockResolvedValue([]),
					execPackageManagerCmd: vi.fn().mockResolvedValue("ok"),
				},
				configurable: true,
			});
			Object.defineProperty(createNextApp, "directoryService", {
				value: {
					dirExists: vi.fn().mockResolvedValue(false),
					createDir: vi.fn().mockResolvedValue(undefined),
					removeDir: vi.fn().mockResolvedValue(undefined),
				},
				configurable: true,
			});
			Object.defineProperty(createNextApp, "fileService", {
				value: {
					replaceFileExtension: vi.fn(),
					touchFile: vi.fn().mockResolvedValue(undefined),
				},
				configurable: true,
			});
			Object.defineProperty(createNextApp, "createComponent", {
				value: { run: vi.fn().mockResolvedValue(undefined) },
				configurable: true,
			});
			Object.defineProperty(createNextApp, "consoleService", {
				value: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
				configurable: true,
			});

			await createNextApp.createApp({
				realpath: mockDirPath,
				appExistsAlready: false,
			});

			expect(createNextApp.cliService.execCmd).toHaveBeenCalledWith(
				["npx create-next-app", mockDirPath, "--use-npm"],
				dirname(mockDirPath),
			);
			expect(createNextApp.fileService.touchFile).toHaveBeenCalledWith(
				join(mockDirPath, "tsconfig.json"),
			);
			expect(
				createNextApp.packageManagerService.execPackageManagerCmd,
			).toHaveBeenCalledWith(mockDirPath, ["next", "build"]);
			expect(
				createNextApp.packageManagerService.uninstallPackages,
			).toHaveBeenCalled();
			expect(
				createNextApp.packageManagerService.installPackages,
			).toHaveBeenCalledTimes(2);
			expect(createNextApp.directoryService.createDir).toHaveBeenCalled();
			expect(createNextApp.createComponent.run).toHaveBeenCalledTimes(1);
			expect(createNextApp.directoryService.removeDir).toHaveBeenCalled();
		});

		it("should replace the generated CSS imports with SCSS in the Next app files", async () => {
			const appFile = {
				replaceContent: vi.fn(),
				saveFile: vi.fn().mockResolvedValue(undefined),
			};
			const indexPage = {
				replaceContent: vi.fn(),
				saveFile: vi.fn().mockResolvedValue(undefined),
			};
			Object.defineProperty(createNextApp, "packageManagerService", {
				value: { installPackages: vi.fn().mockResolvedValue([]) },
				configurable: true,
			});
			Object.defineProperty(createNextApp, "fileFactory", {
				value: {
					fromFile: vi.fn().mockImplementation(async (path: string) => {
						if (path.endsWith("pages/_app.tsx")) return appFile;
						return indexPage;
					}),
				},
				configurable: true,
			});
			Object.defineProperty(createNextApp, "fileService", {
				value: { replaceFileExtension: vi.fn() },
				configurable: true,
			});
			Object.defineProperty(createNextApp, "consoleService", {
				value: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
				configurable: true,
			});

			await createNextApp.addSass(mockDirPath);

			expect(
				createNextApp.fileService.replaceFileExtension,
			).toHaveBeenCalledTimes(2);
			expect(createNextApp.fileFactory.fromFile).toHaveBeenCalledTimes(2);
			expect(appFile.replaceContent).toHaveBeenCalled();
			expect(indexPage.replaceContent).toHaveBeenCalled();
		});
	});
});
