import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { GitService } from "./GitService";

describe("gitService", () => {
  let service: GitService;
  let testDir: DirResult;

  beforeAll(() => {
    service = container.get(GitService);
  });

  afterEach(() => testDir?.removeCallback());

  describe("isAGitRepository", () => {
    it("should return true when the given directory path is a git repository", async () => {
      const result = await service.isAGitRepository(__dirname);
      expect(result).toEqual(true);
    });

    it("should return false when the given directory path is not a git repository", async () => {
      testDir = await createTmpDir();
      const result = await service.isAGitRepository(testDir.name);
      expect(result).toEqual(false);
    });
  });
});
