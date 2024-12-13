import { readFile } from "fs/promises";
import { join } from "path";

import container from "../../container";
import { mockDir, mockDirPath, restoreMockFs } from "../../tests/mock-fs";
import { CliService } from "../CliService";
import { FileDiffService } from "./FileDiffService";
import { FileFactory } from "./FileFactory";
import { FileService } from "./FileService";
import { TypescriptFile } from "./TypescriptFile";
import { DirectoryService } from "./DirectoryService";

describe("services - File - TypescriptFile", () => {
  const fileName = "test.ts";
  const filePath = join(mockDirPath, fileName);

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

  afterEach(restoreMockFs);
  afterAll(jest.resetAllMocks);

  describe("getContent", () => {
    it("should get content not containing imports", () => {
      const fileContent = `class Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing file import", () => {
      const fileContent = `import './index.scss';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing named import", () => {
      const fileContent = `import React from 'react';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing default import", () => {
      const fileContent = `import * as serviceWorker from './serviceWorker';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing default and named import", () => {
      const fileContent = `import React, { ReactElement } from 'react';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing name binded import", () => {
      const fileContent = `import { IAppProps } from '@reactionable/core';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should get content containing name binded aliased import", () => {
      const fileContent = `import { App as CoreApp } from '@reactionable/core';\n\nclass Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      expect(file.getContent()).toEqual(fileContent);
    });

    it("should retrieve saved file content", async () => {
      mockDir();

      const fileContent = `import { App as CoreApp, IAppProps } from '@reactionable/core';
import * as serviceWorker from './serviceWorker';
import './index.scss';
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();`;

      const file = new TypescriptFile(
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

      const expectedFileContent = `import { App as CoreApp, IAppProps } from '@reactionable/core';
import * as serviceWorker from './serviceWorker';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();`;
      expect(result.getContent()).toEqual(expectedFileContent);
      expect(await fileService.fileExists(filePath)).toEqual(true);
      expect(await readFile(filePath, "utf-8")).toEqual(expectedFileContent);
    });
  });

  describe("setImports", () => {
    it("should add default imports", () => {
      const fileContent = `class Test {}`;

      const file = new TypescriptFile(
        cliService,
        directoryService,
        fileService,
        fileDiffService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      file.setImports([{ packageName: "test-package", modules: { TestPackage: "default" } }]);

      const expectedContent = `import TestPackage from 'test-package';\n\nclass Test {}`;
      expect(file.getContent()).toEqual(expectedContent);
    });
  });
});
