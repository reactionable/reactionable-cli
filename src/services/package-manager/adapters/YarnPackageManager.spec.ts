import { jest } from "@jest/globals";
import { EventEmitter } from 'events';
import type { ChildProcess } from 'child_process';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mockSpawn: any = null;

// Reset all modules before mocking
jest.resetModules();

// Use unstable_mockModule for ESM compatibility
jest.unstable_mockModule("child_process", () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spawn: (...args: any[]): ChildProcess => {
      if (_mockSpawn) {
        return _mockSpawn(...args);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dummyProcess: any = new EventEmitter();
      dummyProcess.stdout = new EventEmitter();
      dummyProcess.stderr = new EventEmitter();
      dummyProcess.stdin = {
        write: () => true,
        end: () => {},
      };
      dummyProcess.pid = 12345;
      dummyProcess.kill = () => true;
      
      process.nextTick(() => {
        dummyProcess.stdout.emit('data', Buffer.from(''));
        dummyProcess.stdout.emit('end');
        dummyProcess.stderr.emit('end');
        dummyProcess.emit('exit', 0, null);
        dummyProcess.emit('close', 0, null);
      });
      return dummyProcess as ChildProcess;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __setMockSpawn: (mock: any) => { _mockSpawn = mock; },
    exec: jest.fn(),
    execFile: jest.fn(),
    fork: jest.fn(),
    execSync: jest.fn(),
    execFileSync: jest.fn(),
    spawnSync: jest.fn(),
  };
});

const container = (await import("../../../container")).default;
const { mockYarnCmd, mockYarnWorkspacesInfoCmd, restoreMockCmd } = await import("../../../tests/mock-cmd");
const {
  mockDirPath,
  mockMonorepoPackageDirName,
  mockMonorepoPackageDirPath,
  mockPackageName,
  mockYarnDir,
  mockYarnMonorepoDir,
  restoreMockFs,
} = await import("../../../tests/mock-fs");
const { CliService } = await import("../../CliService");
const { FileFactory } = await import("../../file/FileFactory");
const { FileService } = await import("../../file/FileService");
const { YarnPackageManager } = await import("../adapters/YarnPackageManager");

describe("yarnPackageManager", () => {
  const cliService = container.get(CliService);
  const fileService = container.get(FileService);
  const fileFactory = container.get(FileFactory);

  let adapter: InstanceType<typeof YarnPackageManager>;

  beforeEach(() => {
    adapter = new YarnPackageManager(cliService, fileService, fileFactory, mockDirPath);
    mockYarnDir();
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  describe("getMonorepoRootPath", () => {
    it("should retrieve monorepo root path for given directory path", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toStrictEqual(mockDirPath);
    });

    it("should retrieve undefined if given directory path is not a monorepo", async () => {
      expect.hasAssertions();

      mockYarnCmd();

      const result = await adapter.getMonorepoRootPath();

      expect(result).toBeUndefined();
    });
  });

  describe("isMonorepoPackage", () => {
    it("should retrieve true if given directory path is a monorepo package", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      adapter = new YarnPackageManager(
        cliService,
        fileService,
        fileFactory,
        mockMonorepoPackageDirPath
      );

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(true);
    });

    it("should retrieve false if given directory path is a monorepo root package", async () => {
      expect.hasAssertions();

      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });

    it("should retrieve false if given directory path is a not a monorepo", async () => {
      expect.hasAssertions();

      mockYarnCmd().mockError("Cannot find the root of your workspace");

      const result = await adapter.isMonorepoPackage();

      expect(result).toStrictEqual(false);
    });
  });
});
