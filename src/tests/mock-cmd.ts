import { resolve } from "path";
import { cwd } from "process";
import * as child_process from "child_process";

import mockSpawn from "mock-spawn";
import shelljs from "shelljs";
import type { ShellString as ShellStringType } from "shelljs";
import { jest } from "@jest/globals";

let spawnMock;

export type MockedCmd = {
  mockResult: (stdin: string) => void;
  mockError: (stderr: string) => void;
};

function mockCmd(cmd: string): MockedCmd {
  jest
    .spyOn(shelljs, "which")
    .mockImplementation(() => cmd as ShellStringType);

  spawnMock = mockSpawn();
  
  // Use the __setMockSpawn function from the mocked module if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (child_process as any).__setMockSpawn === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (child_process as any).__setMockSpawn(spawnMock);
  }
  
  // Set a default empty response to prevent hangs
  spawnMock.setDefault(spawnMock.simple(0, ""));

  return {
    mockResult: (stdin: string) => {
      spawnMock.setDefault(spawnMock.simple(0, stdin));
    },
    mockError: (stderr: string) => {
      spawnMock.setDefault(spawnMock.simple(1, undefined, stderr));
    },
  };
}

// Export the mock for use in tests
export function getMockSpawn() {
  return spawnMock;
}

export function mockYarnCmd(): MockedCmd {
  return mockCmd("yarn");
}

export function mockYarnBinCmd(mockDirPath: string): MockedCmd {
  const yarnCmdMock = mockYarnCmd();

  const nodeModulesRealpath = resolve(cwd(), mockDirPath, "node_modules");
  const binRealpath = resolve(nodeModulesRealpath, "./bin");
  yarnCmdMock.mockResult(binRealpath);

  return yarnCmdMock;
}

export function mockYarnWorkspacesInfoCmd(
  mockPackageName?: string,
  mockMonorepoPackageDirName?: string
): MockedCmd {
  const yarnCmdMock = mockYarnCmd();

  const data: { [key: string]: { location?: string } } = {};
  if (mockPackageName) {
    data[mockPackageName] = {};
    if (mockMonorepoPackageDirName) {
      data[mockPackageName].location = `packages/${mockMonorepoPackageDirName}`;
    }
  }

  yarnCmdMock.mockResult(JSON.stringify({ data: JSON.stringify(data) }));

  return yarnCmdMock;
}

export function restoreMockCmd(): void {
  // Clear the mock spawn if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (child_process as any).__setMockSpawn === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (child_process as any).__setMockSpawn(null);
  }
  jest.restoreAllMocks();
}
