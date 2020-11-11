import { readFileSync } from 'fs';
import { join } from 'path';

import container from '../../container';
import { mockDir, mockDirPath, restoreMockFs } from '../../tests/mock-fs';
import { CliService } from '../CliService';
import { FileFactory } from './FileFactory';
import { FileService } from './FileService';
import { TypescriptFile } from './TypescriptFile';

describe('services - File - TypescriptFile', () => {
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
    it('should retrieve file content', async () => {
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

    it('should retrieve file content having import file string', async () => {
      mockDir();

      const fileContent = `import './index.scss';\n`;

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
