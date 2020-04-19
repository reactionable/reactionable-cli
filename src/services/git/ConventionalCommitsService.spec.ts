import { tmpdir } from 'os';

import container from '../../container';
import { ConventionalCommitsService } from './ConventionalCommitsService';
import mock from 'mock-fs';

describe('ConventionalCommitsService', () => {
  let service: ConventionalCommitsService;

  const dirPath = 'test/dir/path';

  beforeAll(() => {
    service = container.get(ConventionalCommitsService);
  });

  afterEach(mock.restore);

  describe('hasConventionalCommits', () => {
    it('should return false when conventional commit is not enabled', async () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({}),
        },
      });
      const result = await service.hasConventionalCommits(dirPath);
      expect(result).toEqual(false);
    });

    it('should return true when conventional commit is enabled', async () => {
      mock({
        [dirPath]: {
          'package.json': JSON.stringify({
            devDependencies: {
              '@commitlint/cli': '1.0.0',
              '@commitlint/config-conventional': '1.0.0',
              'cz-conventional-changelog': '1.0.0',
              husky: '1.0.0',
            },
            husky: {
              hooks: {
                'commit-msg': 'test',
              },
            },
            config: {
              commitizen: {
                path: 'test',
              },
            },
          }),
        },
      });
      const result = await service.hasConventionalCommits(dirPath);
      expect(result).toEqual(false);
    });
  });
});
