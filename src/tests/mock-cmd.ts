import { resolve } from "path";
import { cwd } from "process";
import * as child_process from "child_process";

import mockSpawn from "mock-spawn";
import shelljs from "shelljs";
import type { ShellString as ShellStringType } from "shelljs";
import { jest } from "@jest/globals";

let spawnMock;
let spawnSpy;

export type MockedCmd = {
  mockResult: (stdin: string) => void;
  mockError: (stderr: string) => void;
};

function mockCmd(cmd: string): MockedCmd {
  jest.mock("shelljs");

  jest
    .spyOn(shelljs, "which")
    .mockImplementation(() => cmd as ShellStringType);

  spawnMock = mockSpawn();

  // Mock the spawn function using jest.spyOn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spawnSpy = jest.spyOn(child_process, "spawn").mockImplementation(spawnMock as any);

  return {
    mockResult: (stdin: string) => {
      spawnMock.setDefault(spawnMock.simple(0, stdin));
    },
    mockError: (stderr: string) => {
      spawnMock.setDefault(spawnMock.simple(1, undefined, stderr));
    },
  };
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
  if (spawnSpy) {
    spawnSpy.mockRestore();
    spawnSpy = undefined;
  }
  jest.restoreAllMocks();
}
