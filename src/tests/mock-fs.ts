import mockFs from "mock-fs";
import type FileSystem from "mock-fs/lib/filesystem";
import { vi } from "vitest";

let logsTemp: unknown[][] = [];
let logMock: ReturnType<typeof vi.spyOn> | undefined;

function mock(
	config?: FileSystem.DirectoryItems,
	options?: FileSystem.Options,
): void {
	if (!logMock) {
		logMock = vi.spyOn(console, "log").mockImplementation((...args) => {
			logsTemp.push(args);
		});
	}
	mockFs(config, options);
}

export const mockPackageName = "test-project";
export const mockDirPath = "test/dir/path";

export const mockMonorepoRootName = "test-monorepo-project";
export const mockMonorepoPackageDirName = "test-package";
export const mockMonorepoPackageDirPath = `${mockDirPath}/packages/${mockMonorepoPackageDirName}`;

export function mockDir(
	config?: FileSystem.DirectoryItems,
	dirPath: string = mockDirPath,
): void {
	mock({
		[dirPath]: config || {},
	});
}

function packageDirMockConfig(
	config?: FileSystem.DirectoryItems,
): FileSystem.DirectoryItems {
	return {
		"package.json": JSON.stringify({
			name: mockPackageName,
		}),
		node_modules: {
			".bin": {},
		},
		...(config || {}),
	};
}

function yarnDirMockConfig(
	config?: FileSystem.DirectoryItems,
): FileSystem.DirectoryItems {
	return packageDirMockConfig({ "yarn.lock": "", ...(config || {}) });
}

export function mockYarnDir(
	config?: FileSystem.DirectoryItems,
	dirPath?: string,
): void {
	mockDir(yarnDirMockConfig(config), dirPath);
}

function monorepoYarnDirMockConfig(
	config?: FileSystem.DirectoryItems,
): FileSystem.DirectoryItems {
	return yarnDirMockConfig({
		"package.json": JSON.stringify({
			name: mockMonorepoRootName,
			workspaces: ["packages/*"],
		}),
		packages: {
			[mockMonorepoPackageDirName]: yarnDirMockConfig(config),
		},
	});
}

export function mockYarnMonorepoDir(
	config?: FileSystem.DirectoryItems,
	dirPath?: string,
): void {
	mockDir(monorepoYarnDirMockConfig(config), dirPath);
}

function npmDirMockConfig(
	config?: FileSystem.DirectoryItems,
): FileSystem.DirectoryItems {
	return packageDirMockConfig({ "package-lock.json": "", ...(config || {}) });
}

export function mockNpmDir(
	config?: FileSystem.DirectoryItems,
	dirPath?: string,
): void {
	mockDir(npmDirMockConfig(config), dirPath);
}

function monorepoNpmDirMockConfig(
	config?: FileSystem.DirectoryItems,
): FileSystem.DirectoryItems {
	return npmDirMockConfig({
		"package.json": JSON.stringify({
			name: mockMonorepoRootName,
			workspaces: ["packages/*"],
		}),
		packages: {
			[mockMonorepoPackageDirName]: packageDirMockConfig(config),
		},
	});
}

export function mockNpmMonorepoDir(
	config?: FileSystem.DirectoryItems,
	dirPath?: string,
): void {
	mockDir(monorepoNpmDirMockConfig(config), dirPath);
}

export function restoreMockFs(): void {
	if (logMock) {
		logMock.mockRestore();
		logMock = undefined;
	}
	logsTemp.map((el) => console.log(...el));
	logsTemp = [];
	mockFs.restore();
}
