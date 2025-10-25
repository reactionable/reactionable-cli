import { resolve } from "path";
import { cwd } from "process";

import mockSpawn from "mock-spawn";
import shelljs from "shelljs";
import type { ShellString as ShellStringType } from "shelljs";
import { jest } from "@jest/globals";

let originalSpawn;
let spawnMock;

export type MockedCmd = {
  mockResult: (stdin: string) => void;
  mockError: (stderr: string) => void;
};

function mockCmd(cmd: string): MockedCmd {
  jest.mock("shelljs");

  jest
    .spyOn(shelljs, "which")
    .mockImplementation(() => cmd as ShellStringType);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  originalSpawn = require("child_process").spawn;
  spawnMock = mockSpawn();

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("child_process").spawn = spawnMock;

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
  jest.restoreAllMocks();
  if (originalSpawn) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("child_process").spawn = originalSpawn;
    originalSpawn = undefined;
  }
}
