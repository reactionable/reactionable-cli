import { join } from 'path';
import { readFileSync } from 'fs';

import container from '../../container';
import { restoreMockFs, mockDir, mockDirPath } from '../../tests/mock-fs';
import { CliService } from '../CliService';
import { FileService } from './FileService';
import { FileFactory } from './FileFactory';
import { TypescriptFile } from './TypescriptFile';

describe('Services - File - TypescriptFile', () => {
  const fileName = 'test.ts';
  const filePath = join(mockDirPath, fileName);

  let cliService: CliService;
  let fileService: FileService;
  let fileFactory: FileFactory;

  beforeAll(() => {
    jest.mock('inquirer');

    cliService = container.get(CliService);
    fileService = container.get(FileService);
    fileFactory = container.get(FileFactory);
  });

  afterEach(restoreMockFs);
  afterAll(jest.resetAllMocks);

  describe('getContent', () => {
    it.only('should retrieve file content', async () => {
      mockDir();

      const fileContent = `import { App as CoreApp, IAppProps } from '@reactionable/core';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();`;

      const file = new TypescriptFile(
        cliService,
        fileService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(fileContent);
      expect(fileService.fileExistsSync(filePath)).toEqual(true);
      expect(readFileSync(filePath).toString()).toEqual(fileContent);
    });
  });
});
