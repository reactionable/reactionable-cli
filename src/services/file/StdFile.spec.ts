import { readFile } from "fs/promises";
import { join } from "path";

import prompts from "prompts";

import container from "../../container";
import { mockDir, mockDirPath, restoreMockFs } from "../../tests/mock-fs";
import { CliService } from "../CliService";
import { FileDiffService } from "./FileDiffService";
import { FileFactory } from "./FileFactory";
import { FileService } from "./FileService";
import { StdFile } from "./StdFile";
import { DirectoryService } from "./DirectoryService";

describe("services - File - StdFile", () => {
  let cliService: CliService;
  let directoryService: DirectoryService;
  let fileService: FileService;
  let fileDiffService: FileDiffService;
  let fileFactory: FileFactory;

  beforeAll(() => {
    cliService = container.get(CliService);
    directoryService = container.get(DirectoryService);
    fileService = container.get(FileService);
    fileDiffService = container.get(FileDiffService);
    fileFactory = container.get(FileFactory);
  });

  afterEach(() => {
    restoreMockFs();
  });

  afterAll(jest.resetAllMocks);

  describe("saveFile", () => {
    it("should save a new file", async () => {
      mockDir();

      const fileName = "test.txt";
      const filePath = join(mockDirPath, fileName);

      const fileContent = "test content";
      const file = new StdFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(fileContent);
      expect(await fileService.fileExists(filePath)).toEqual(true);
      expect(await readFile(filePath, "utf-8")).toEqual(fileContent);
    });

    it("should override an existing file", async () => {
      const fileName = "test-override.txt";
      const filePath = join(mockDirPath, fileName);

      mockDir({ [fileName]: "test original content" });

      prompts.inject(["overwrite"]);

      const fileContent = "test new content";
      const file = new StdFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(fileContent);
      expect(await readFile(filePath, "utf-8")).toEqual(fileContent);
    });

    it("should not override an existing file", async () => {
      const fileName = "test-not-override.txt";
      const filePath = join(mockDirPath, fileName);
      const originalContent = "test original content";

      mockDir({ [fileName]: originalContent });
      expect(await readFile(filePath, "utf-8")).toEqual(originalContent);
      prompts.inject(["cancel"]);

      const file = new StdFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        "test new content"
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(originalContent);
      expect(await readFile(filePath, "utf-8")).toEqual(originalContent);
    });

    it("should ask for overriding an existing file only once time if changes occured in the same place", async () => {
      // Arrange
      const fileName = "test-override-once.txt";
      const filePath = join(mockDirPath, fileName);
      const originalContent = `line 1 content
line 2 content
line 3 content
line 4 content`;

      mockDir({ [fileName]: originalContent });

      prompts.inject(["overwrite"]);

      const newContent = `line 1 content
line 2 content new
line 3 content
line 4 content`;

      // Act
      let file = new StdFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        newContent
      );
      await file.saveFile();

      // Assert
      expect(file.getContent()).toEqual(newContent);
      expect(await readFile(filePath, "utf-8")).toEqual(newContent);

      // Mock prompt in case of test failure
      prompts.inject(["cancel"]);

      const anotherNewContent = `line 1 content
line 2 content new one
line 3 content
line 4 content`;

      file = new StdFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        anotherNewContent
      );

      await file.saveFile();

      expect(file.getContent()).toEqual(anotherNewContent);
      expect(await readFile(filePath, "utf-8")).toEqual(anotherNewContent);
    });
  });
});
