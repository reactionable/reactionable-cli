import { join } from "path";

import container from "../../container";
import { mockDir, mockDirPath, restoreMockFs } from "../../tests/mock-fs";
import { FileDiffService } from "./FileDiffService";

describe("FileDiffService", () => {
  const fileName = "test.txt";
  const filePath = join(mockDirPath, fileName);

  let service: FileDiffService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(FileDiffService);
  });

  afterEach(() => {
    container.restore();
    restoreMockFs();
  });

  describe("getFileContentDiff", () => {
    it("should retrieve empty diff when file content and new content are the same", async () => {
      const originalContent = `line 1 content
line 2 content
line 3 content
line 4 content`;

      mockDir({ [fileName]: originalContent });

      const diffs = await service.getFileContentChanges(filePath, originalContent, originalContent);

      expect(diffs).toEqual([]);
    });

    it("should retrieve diffs when file content and new content are different", async () => {
      const originalContent = `line 1 content
line 2 content
line 3 content
line 4 content`;

      const newContent = `line 1 content
line 2 content
line new content
line 4 content`;

      mockDir({ [fileName]: originalContent });

      const diffs = await service.getFileContentChanges(filePath, originalContent, newContent);

      expect(diffs).toEqual([
        {
          added: false,
          count: 1,
          removed: false,
          value: "line 1 content\n",
        },
        {
          added: false,
          count: 1,
          removed: false,
          value: "line 2 content\n",
        },
        {
          added: false,
          count: 1,
          removed: true,
          value: "line 3 content\n",
        },
        {
          added: true,
          count: 1,
          removed: false,
          value: "line new content\n",
        },
        {
          added: false,
          count: 1,
          removed: false,
          value: "line 4 content",
        },
      ]);
    });
  });
});
