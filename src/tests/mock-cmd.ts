import shelljs from 'shelljs';
import mockSpawn from 'mock-spawn';

let spawnMock;
let originalSpawn;

export type MockedCmd = {
  mockResult: (stdin: string) => void;
  mockError: (stderr: string) => void;
};

function mockCmd(cmd: string): MockedCmd {
  jest.mock('shelljs');

  shelljs.which = jest.fn().mockReturnValue(cmd);

  spawnMock = mockSpawn();
  originalSpawn = require('child_process').spawn;
  require('child_process').spawn = spawnMock;

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
  return mockCmd('yarn');
}

export function restoreMockCmd() {
  jest.restoreAllMocks();
  if (originalSpawn) {
    require('child_process').spawn = originalSpawn;
    originalSpawn = undefined;
  }
}
