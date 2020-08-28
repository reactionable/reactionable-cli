import container from '../container';

import { TemplateService } from './TemplateService';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(TemplateService);
  });

  afterEach(() => {
    container.restore();
  });

  describe('createFileFromTemplate', () => {
    it('should throws an error if file directory does not exist', async () => {
      const createFileOperation = service.createFileFromTemplate(
        '/unexisting-directory/test.js',
        'test-namespace',
        {}
      );

      expect(createFileOperation).rejects.toThrowError(
        `Unable to create file "/unexisting-directory/test.js", directory "/unexisting-directory" does not exist`
      );
    });
  });
});
