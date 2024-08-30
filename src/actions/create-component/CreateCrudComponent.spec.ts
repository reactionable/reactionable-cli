import { stat, readFile } from "fs/promises";
import { resolve } from "path";

import prompts from "prompts";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import CreateCrudComponent from "./CreateCrudComponent";

describe("createCrudComponent", () => {
  let createCrudComponent: CreateCrudComponent;

  let testDir: DirResult;

  beforeAll(async () => {
    createCrudComponent = container.get(CreateCrudComponent);
  });

  describe("construct", () => {
    it("should be initialized", () => {
      expect(createCrudComponent).toBeInstanceOf(CreateCrudComponent);
    });
  });

  describe.each([
    ["React", "test-react-project", "src"],
    ["NextJs", "test-nextjs-project", "lib"],
  ])("Run for a %s project", (name, testProjectPath, libPath) => {
    let testDirPath: string;

    beforeAll(async () => {
      testDir = await createTmpDir(testProjectPath);
      testDirPath = testDir.name;

      prompts.inject(["overwrite"]);
      await createCrudComponent.run({
        realpath: testDirPath,
        name: "test entity",
      });
    });

    afterAll(() => testDir?.removeCallback());

    const expectedFiles = [
      // Config
      "components/test-entities/TestEntitiesConfig.tsx",
      // Crud entry point
      "components/test-entities/TestEntities.test.tsx",
      "components/test-entities/TestEntities.tsx",
      // Create
      "components/test-entities/create-test-entity/CreateTestEntity.test.tsx",
      "components/test-entities/create-test-entity/CreateTestEntity.tsx",
      // Read
      "components/test-entities/read-test-entity/ReadTestEntity.test.tsx",
      "components/test-entities/read-test-entity/ReadTestEntity.tsx",
      // Update
      "components/test-entities/update-test-entity/UpdateTestEntity.test.tsx",
      "components/test-entities/update-test-entity/UpdateTestEntity.tsx",
      // Delete
      "components/test-entities/delete-test-entity/DeleteTestEntity.test.tsx",
      "components/test-entities/delete-test-entity/DeleteTestEntity.tsx",
      // List
      "components/test-entities/list-test-entities/ListTestEntities.test.tsx",
      "components/test-entities/list-test-entities/ListTestEntities.tsx",
      // Translations
      "i18n/i18n.ts",
      "i18n/locales/en/testEntities.json",
      "i18n/locales/fr/testEntities.json",
    ];

    it.each(expectedFiles.map((value) => [value]))(
      'should create crud component file "%s"',
      async (expectedFile) => {
        const filePath = resolve(testDirPath, libPath, expectedFile);

        expect((await stat(filePath)).isFile()).toBe(true);
        expect(await readFile(filePath, "utf-8")).toMatchSnapshot(expectedFile);
      }
    );
  });
});
