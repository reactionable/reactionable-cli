import { stat, readFile } from "fs/promises";
import { resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import { TemplateService } from "./TemplateService";

describe("templateService", () => {
  let testDir: DirResult;
  let service: TemplateService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(TemplateService);
  });

  afterEach(() => {
    container.restore();
    testDir?.removeCallback();
  });

  describe("renderTemplate", () => {
    it("should create a file from given namespace", async () => {
      testDir = await createTmpDir();

      const testDirPath = testDir.name;
      const templateContext = {
        projectName: "test-project",
        i18nPath: "src/i18n",
        hostingPackage: "@reactionable/core",
      };

      await service.renderTemplate(testDirPath, "i18n", templateContext);

      const expectedI18nFile = resolve(testDirPath, "src/i18n/i18n.ts");
      expect((await stat(expectedI18nFile)).isFile()).toBe(true);
      expect(await readFile(expectedI18nFile, "utf-8")).toMatchSnapshot();

      const expectedTranslationFile = resolve(testDirPath, "src/i18n/locales/en/common.json");
      expect((await stat(expectedTranslationFile)).isFile()).toBe(true);
      expect(await readFile(expectedTranslationFile, "utf-8")).toMatchSnapshot();
    });

    it("should create a file from given namespace having nested config", async () => {
      testDir = await createTmpDir();

      const testDirPath = testDir.name;
      const templateContext = {
        componentDirPath: resolve(testDirPath, "src/components/test-component"),
        i18nPath: "src/i18n",
        entityName: "TestEntity",
        entitiesName: "TestEntities",
      };

      await service.renderTemplate(testDir.name, "create-component/crud", templateContext);

      const expectedConfigFile = resolve(
        testDirPath,
        "src/components/test-component/TestEntitiesConfig.tsx"
      );
      expect((await stat(expectedConfigFile)).isFile()).toBe(true);
      expect(await readFile(expectedConfigFile, "utf-8")).toMatchSnapshot("TestEntitiesConfig.tsx");

      const expectedTranslationFile = resolve(testDirPath, "src/i18n/locales/en/testEntities.json");
      expect((await stat(expectedTranslationFile)).isFile()).toBe(true);
      expect(await readFile(expectedTranslationFile, "utf-8")).toMatchSnapshot("testEntities.json");
    });
  });

  describe("createFileFromTemplate", () => {
    it("should throws an error if file directory does not exist", async () => {
      const createFileOperation = service.createFileFromTemplate(
        "/unexisting-directory/test.js",
        "test-namespace",
        {}
      );

      await expect(createFileOperation).rejects.toThrow(
        `Unable to create file "/unexisting-directory/test.js", directory "/unexisting-directory" does not exist`
      );
    });
  });
});
