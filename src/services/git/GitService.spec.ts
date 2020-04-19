import { resolve } from 'path';
import { tmpdir } from 'os';

import container from '../../container';
import { GitService } from './GitService';

describe('GitService', () => {
  let service: GitService;

  beforeAll(() => {
    service = container.get(GitService);
  });
  let testDirPath: string;

  beforeAll(() => {
    testDirPath = resolve('__tests__/test-project');
  });

  describe('isAGitRepository', () => {
    it('should return true when the given directory path is a git repository', async () => {
      const result = await service.isAGitRepository(testDirPath);
      expect(result).toEqual(true);
    });

    it('should return false when the given directory path is not a git repository', async () => {
      const result = await service.isAGitRepository(tmpdir());
      expect(result).toEqual(false);
    });
  });
});
