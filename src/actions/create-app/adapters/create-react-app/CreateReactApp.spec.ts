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
import CreateReactApp from "./CreateReactApp";

describe("createReactApp", () => {
	let createReactApp: CreateReactApp;

	beforeAll(() => {
		createReactApp = container.get(CreateReactApp);
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

			const result = await createReactApp.checkIfAppExistsAlready(
				join(mockDirPath, "app"),
			);
			expect(result).toEqual(false);
		});

		it("should return undefined if user do not want overriding existing directory", async () => {
			mockDir();

			prompts.inject([false]);

			const result = await createReactApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toBeUndefined();
		});

		it("should return false if directory exists but do not have expected files", async () => {
			mockDir();
			mockYarnCmd();

			prompts.inject([true]);

			const result = await createReactApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toEqual(false);
		});

		it("should return true if directory exists and have expected files", async () => {
			mockYarnCmd();
			mockYarnDir({
				"package.json": JSON.stringify({
					dependencies: {
						react: "1.0.0",
					},
				}),
				src: {
					"react-app-env.d.ts": "",
				},
			});

			prompts.inject([true]);

			const result = await createReactApp.checkIfAppExistsAlready(mockDirPath);
			expect(result).toEqual(true);
		});
	});

	describe("createApp and Sass paths", () => {
		it("should create the app with the TypeScript template and install base dependencies", async () => {
			Object.defineProperty(createReactApp, "cliService", {
				value: {
					getGlobalCmd: vi.fn().mockReturnValue("npx create-react-app"),
					execCmd: vi.fn().mockResolvedValue("ok"),
					promptToChoose: vi.fn().mockResolvedValue("npm"),
				},
				configurable: true,
			});
			Object.defineProperty(createReactApp, "packageManagerService", {
				value: {
					getAvailablePackageManagers: vi.fn().mockReturnValue(["npm"]),
					installPackages: vi.fn().mockResolvedValue([]),
				},
				configurable: true,
			});
			Object.defineProperty(createReactApp, "directoryService", {
				value: {
					createDir: vi.fn().mockResolvedValue(undefined),
				},
				configurable: true,
			});
			Object.defineProperty(createReactApp, "createComponent", {
				value: { run: vi.fn().mockResolvedValue(undefined) },
				configurable: true,
			});
			Object.defineProperty(createReactApp, "consoleService", {
				value: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
				configurable: true,
			});

			await createReactApp.createApp({
				realpath: mockDirPath,
				appExistsAlready: false,
			});

			expect(createReactApp.cliService.execCmd).toHaveBeenCalledWith(
				[
					"npx create-react-app",
					mockDirPath,
					"--template",
					"typescript",
					"--use-npm",
				],
				dirname(mockDirPath),
			);
			expect(
				createReactApp.packageManagerService.installPackages,
			).toHaveBeenCalledTimes(2);
			expect(createReactApp.createComponent.run).toHaveBeenCalledTimes(3);
		});

		it("should convert CSS imports to SCSS for the generated app files", async () => {
			const entrypoint = {
				replaceContent: vi.fn(),
				saveFile: vi.fn().mockResolvedValue(undefined),
			};
			const appFile = {
				replaceContent: vi.fn(),
				saveFile: vi.fn().mockResolvedValue(undefined),
			};
			Object.defineProperty(createReactApp, "packageManagerService", {
				value: { installPackages: vi.fn().mockResolvedValue([]) },
				configurable: true,
			});
			Object.defineProperty(createReactApp, "fileFactory", {
				value: {
					fromFile: vi.fn().mockImplementation(async (path: string) => {
						if (path.endsWith("src/index.tsx")) return entrypoint;
						return appFile;
					}),
				},
				configurable: true,
			});
			Object.defineProperty(createReactApp, "fileService", {
				value: { replaceFileExtension: vi.fn() },
				configurable: true,
			});
			Object.defineProperty(createReactApp, "consoleService", {
				value: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
				configurable: true,
			});

			await createReactApp.addSass(mockDirPath);

			expect(
				createReactApp.fileService.replaceFileExtension,
			).toHaveBeenCalledTimes(2);
			expect(createReactApp.fileFactory.fromFile).toHaveBeenCalledTimes(2);
			expect(entrypoint.replaceContent).toHaveBeenCalled();
			expect(appFile.replaceContent).toHaveBeenCalled();
		});
	});
});
