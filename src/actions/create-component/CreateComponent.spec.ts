import { stat, readFile } from "fs/promises";
import { resolve } from "path";

import container from "../../container";
import { DirResult, createTmpDir } from "../../tests/tmp-dir";
import CreateComponent from "./CreateComponent";

describe("createComponent", () => {
  let createComponent: CreateComponent;

  let testDir: DirResult;

  beforeAll(async () => {
    createComponent = container.get(CreateComponent);
  });

  afterEach(() => {
    testDir && testDir.removeCallback();
  });

  describe("construct", () => {
    it("should be initialized", () => {
      expect(createComponent).toBeInstanceOf(CreateComponent);
    });
  });

  describe("run", () => {
    test.each([
      ["React", "test-react-project", "src"],
      ["NextJs", "test-nextjs-project", "lib"],
    ])(
      "should create expected components files for a %s project",
      async (name, testProjectPath, libPath) => {
        testDir = await createTmpDir(testProjectPath);
        const testDirPath = testDir.name;
        const componentsDirPath = resolve(testDirPath, libPath, "components");

        await createComponent.run({
          realpath: testDirPath,
          name: "test component",
        });

        const expectedComponentFile = resolve(
          componentsDirPath,
          "test-component/TestComponent.tsx"
        );
        expect((await stat(expectedComponentFile)).isFile()).toBe(true);
        expect(await readFile(expectedComponentFile, "utf-8")).toMatchSnapshot();

        const expectedTestComponentFile = resolve(
          componentsDirPath,
          "test-component/TestComponent.test.tsx"
        );
        expect((await stat(expectedTestComponentFile)).isFile()).toBe(true);
        expect(await readFile(expectedTestComponentFile, "utf-8")).toMatchSnapshot();
      }
    );

    it("should create expected React App component files", async () => {
      testDir = await createTmpDir("test-react-project");
      const testDirPath = testDir.name;
      const expectedAppFile = resolve(testDirPath, "src/App.tsx");

      await createComponent.run({
        realpath: testDirPath,
        name: "App",
        componentDirPath: expectedAppFile,
        componentTemplate: "app/react/App.tsx",
      });

      expect((await stat(expectedAppFile)).isFile()).toBe(true);
      expect(await readFile(expectedAppFile, "utf-8")).toMatchSnapshot();

      const expectedTestAppFile = resolve(testDirPath, "src/App.test.tsx");
      expect((await stat(expectedTestAppFile)).isFile()).toBe(true);
      expect(await readFile(expectedTestAppFile, "utf-8")).toMatchSnapshot();
    });

    it("should create expected NextJs App component files", async () => {
      testDir = await createTmpDir("test-nextjs-project");
      const testDirPath = testDir.name;
      const expectedAppFile = resolve(testDirPath, "pages/_app.tsx");

      await createComponent.run({
        realpath: testDirPath,
        name: "App",
        componentDirPath: expectedAppFile,
        componentTemplate: "app/nextjs/App.tsx",
      });

      expect((await stat(expectedAppFile)).isFile()).toBe(true);
      expect(await readFile(expectedAppFile, "utf-8")).toMatchSnapshot();

      const expectedTestAppFile = resolve(testDirPath, "pages/_app.test.tsx");
      expect((await stat(expectedTestAppFile)).isFile()).toBe(true);
      expect(await readFile(expectedTestAppFile, "utf-8")).toMatchSnapshot();
    });
  });
});
