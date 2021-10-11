import { existsSync, readFileSync } from "fs";
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
        testDir = createTmpDir(testProjectPath);
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
        expect(existsSync(expectedComponentFile)).toBe(true);
        expect(readFileSync(expectedComponentFile, "utf-8")).toMatchSnapshot();

        const expectedTestComponentFile = resolve(
          componentsDirPath,
          "test-component/TestComponent.test.tsx"
        );
        expect(existsSync(expectedTestComponentFile)).toBe(true);
        expect(readFileSync(expectedTestComponentFile, "utf-8")).toMatchSnapshot();
      }
    );

    it("should create expected React App component files", async () => {
      testDir = createTmpDir();
      const testDirPath = testDir.name;
      const expectedAppFile = resolve(testDirPath, "src/App.tsx");

      await createComponent.run({
        realpath: testDirPath,
        name: "App",
        componentDirPath: expectedAppFile,
        componentTemplate: "app/react/App.tsx",
      });

      expect(existsSync(expectedAppFile)).toBe(true);
      expect(readFileSync(expectedAppFile, "utf-8")).toMatchSnapshot();

      const expectedTestAppFile = resolve(testDirPath, "src/App.test.tsx");
      expect(existsSync(expectedTestAppFile)).toBe(true);
      expect(readFileSync(expectedTestAppFile, "utf-8")).toMatchSnapshot();
    });

    it("should create expected NextJs App component files", async () => {
      testDir = createTmpDir("test-nextjs-project");
      const testDirPath = testDir.name;
      const expectedAppFile = resolve(testDirPath, "pages/_app.tsx");

      await createComponent.run({
        realpath: testDirPath,
        name: "App",
        componentDirPath: expectedAppFile,
        componentTemplate: "app/nextjs/App.tsx",
      });

      expect(existsSync(expectedAppFile)).toBe(true);
      expect(readFileSync(expectedAppFile, "utf-8")).toMatchSnapshot();

      const expectedTestAppFile = resolve(testDirPath, "pages/_app.test.tsx");
      expect(existsSync(expectedTestAppFile)).toBe(true);
      expect(readFileSync(expectedTestAppFile, "utf-8")).toMatchSnapshot();
    });
  });
});
