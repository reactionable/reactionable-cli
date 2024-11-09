import { writeFile } from "fs/promises";
import { resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { FileFactory } from "./FileFactory";
import { JsonFile } from "./JsonFile";
import { TomlFile } from "./TomlFile";
import { TypescriptFile } from "./TypescriptFile";
import { StdFile } from "./StdFile";

describe("FileFactory", () => {
  let testDir: DirResult;
  let fileFactory: FileFactory;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    fileFactory = container.get(FileFactory);
  });

  afterEach(() => {
    container.restore();
    testDir?.removeCallback();
  });

  describe("fromFile", () => {
    it("should create a file from a file path", async () => {
      testDir = await createTmpDir();

      const filepath = resolve(testDir.name, "test.txt");
      await writeFile(filepath, "test");

      const file = await fileFactory.fromFile(filepath);
      expect(file).toBeInstanceOf(StdFile);

      const content = await file.getContent();
      expect(content).toBe("test");
    });

    it("should create a file from a file path with encoding", async () => {
      testDir = await createTmpDir();

      const filepath = resolve(testDir.name, "test.txt");
      await writeFile(filepath, "test");

      const file = await fileFactory.fromFile(filepath, "utf8");
      expect(file).toBeInstanceOf(StdFile);

      const content = await file.getContent();
      expect(content).toBe("test");
    });

    it("should throw an error when the file does not exist", async () => {
      await expect(fileFactory.fromFile("non-existing-file")).rejects.toThrow(
        'File "non-existing-file" does not exist'
      );
    });
  });

  describe("fromString", () => {
    it("should create a file from a string", async () => {
      const file = await fileFactory.fromString("test", "test.txt");

      expect(file).toBeInstanceOf(StdFile);
      expect(await file.getContent()).toBe("test");
    });

    it("should create a file from a string with encoding", async () => {
      const file = await fileFactory.fromString("test", "test.txt", "utf8");

      expect(file).toBeInstanceOf(StdFile);
      expect(await file.getContent()).toBe("test");
    });

    it("should create a Json file from a string", async () => {
      const file = await fileFactory.fromString('{"test": "test"}', "test.json");

      expect(file).toBeInstanceOf(JsonFile);
      const jsonFile = file as JsonFile;

      expect(await jsonFile.getContent()).toBe('{\n  "test": "test"\n}');
      expect(await jsonFile.getData()).toEqual({ test: "test" });
      expect(await jsonFile.getData("test")).toEqual("test");
      expect(await jsonFile.getData("unknown")).toBeUndefined();
    });

    it("should create a Toml file from a string", async () => {
      const file = await fileFactory.fromString("test = 'test'", "test.toml");

      expect(file).toBeInstanceOf(TomlFile);
      expect(await file.getContent()).toBe('test = "test"\n');
      expect(await (file as TomlFile).getData()).toEqual({ test: "test" });
      expect(await (file as TomlFile).getData("test")).toEqual("test");
      expect(await (file as TomlFile).getData("unknown")).toBeUndefined();
    });

    it("should create a Typescript file from a string", async () => {
      const file = await fileFactory.fromString("console.log('test')", "test.ts");

      expect(file).toBeInstanceOf(TypescriptFile);
      expect(await file.getContent()).toBe("console.log('test')");
    });
  });
});
