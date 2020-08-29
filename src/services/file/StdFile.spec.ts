import { readFileSync } from 'fs';
import { join } from 'path';

import inquirer from 'inquirer';

import container from '../../container';
import { mockDir, mockDirPath, restoreMockFs } from '../../tests/mock-fs';
import { CliService } from '../CliService';
import { FileFactory } from './FileFactory';
import { FileService } from './FileService';
import { StdFile } from './StdFile';

describe('Services - File - StdFile', () => {
  const fileName = 'test.txt';
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

  describe('saveFile', () => {
    it('should save a new file', async () => {
      mockDir();

      const fileContent = 'test content';
      const file = new StdFile(
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

    it('should override an existing file', async () => {
      mockDir({ [fileName]: 'test original content' });

      (inquirer.prompt as any) = jest.fn().mockResolvedValue({ action: 'overwrite' });

      const fileContent = 'test new content';
      const file = new StdFile(
        cliService,
        fileService,
        fileFactory,
        filePath,
        undefined,
        fileContent
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(fileContent);
      expect(readFileSync(filePath).toString()).toEqual(fileContent);
    });

    it('should not override an existing file', async () => {
      const originalContent = 'test original content';

      mockDir({ [fileName]: originalContent });

      (inquirer.prompt as any) = jest.fn().mockResolvedValue({ action: 'cancel' });

      const file = new StdFile(
        cliService,
        fileService,
        fileFactory,
        filePath,
        undefined,
        'test new content'
      );

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(originalContent);
      expect(readFileSync(filePath).toString()).toEqual(originalContent);
    });

    // TODO This behaviour must be implemented
    it.skip('should ask for overriding an existing file only onte time if changes occured in the same place', async () => {
      const originalContent = `
        line 1 content
        line 2 content
        line 3 content
        line 4 content
      `;
      mockDir({ [fileName]: originalContent });

      (inquirer.prompt as any) = jest.fn().mockResolvedValue({ action: 'overwrite' });

      let file = new StdFile(
        cliService,
        fileService,
        fileFactory,
        filePath,
        undefined,
        `
      line 1 content
      line 2 content new
      line 3 content
      line 4 content
    `
      );
      await file.saveFile();

      // Mock prompt in case of test failure
      (inquirer.prompt as any) = jest.fn().mockResolvedValue({ action: 'cancel' });

      const newContent = `
        line 1 content
        line 2 content new one
        line 3 content
        line 4 content
      `;

      file = new StdFile(cliService, fileService, fileFactory, filePath, undefined, newContent);

      const result = await file.saveFile();

      expect(result.getContent()).toEqual(newContent);
      expect(readFileSync(filePath).toString()).toEqual(newContent);
      expect(inquirer.prompt).not.toHaveBeenCalled();
    });
  });
});
