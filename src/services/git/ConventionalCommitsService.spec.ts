import container from '../../container';
import {
  mockYarnBinCmd,
  mockYarnCmd,
  mockYarnWorkspacesInfoCmd,
  restoreMockCmd,
} from '../../tests/mock-cmd';
import {
  mockDirPath,
  mockMonorepoPackageDirName,
  mockMonorepoPackageDirPath,
  mockPackageName,
  mockYarnDir,
  mockYarnMonorepoDir,
  restoreMockFs,
} from '../../tests/mock-fs';
import { ConventionalCommitsService } from './ConventionalCommitsService';

describe('ConventionalCommitsService', () => {
  let service: ConventionalCommitsService;

  beforeAll(() => {
    service = container.get(ConventionalCommitsService);
  });

  afterEach(() => {
    restoreMockFs();
    restoreMockCmd();
  });

  describe('hasConventionalCommits', () => {
    it('should return false when conventional commit is not enabled', async () => {
      mockYarnDir();

      const result = await service.hasConventionalCommits(mockDirPath);

      expect(result).toEqual(false);
    });

    it('should return true when conventional commit is enabled', async () => {
      mockYarnDir({
        'package.json': JSON.stringify({
          devDependencies: {
            '@commitlint/cli': '1.0.0',
            '@commitlint/config-conventional': '1.0.0',
            'cz-conventional-changelog': '1.0.0',
            husky: '1.0.0',
          },
          husky: {
            hooks: {
              'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
            },
          },
          config: {
            commitizen: {
              path: './node_modules/cz-conventional-changelog',
            },
          },
        }),
      });
      mockYarnBinCmd(mockDirPath);

      const result = await service.hasConventionalCommits(mockDirPath);

      expect(result).toEqual(true);
    });
  });

  describe('getConventionalCommitsConfig', () => {
    it('should retrieve conventional commits config for a given directory path', async () => {
      mockYarnDir();
      mockYarnBinCmd(mockDirPath);

      const expectedCommitizenPath = './node_modules/cz-conventional-changelog';

      const result = await service.getConventionalCommitsConfig(mockDirPath);

      expect(result).toEqual({
        config: {
          commitizen: {
            path: expectedCommitizenPath,
          },
        },
        husky: {
          hooks: {
            'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
          },
        },
      });
    });
  });

  describe('formatCommitMessage', () => {
    it('should retrieve format given commit message for a simple repo', async () => {
      mockYarnDir();
      mockYarnCmd().mockError('Cannot find the root of your workspace');

      const commitMessageType = 'feat';
      const commitMessage = 'test commit message';

      const result = await service.formatCommitMessage(
        mockDirPath,
        commitMessageType,
        commitMessage
      );

      expect(result).toEqual('feat: test commit message');
    });

    it('should retrieve format given commit message for a root monorepo', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const commitMessageType = 'feat';
      const commitMessage = 'test commit message';

      const result = await service.formatCommitMessage(
        mockDirPath,
        commitMessageType,
        commitMessage
      );

      expect(result).toEqual('feat: test commit message');
    });

    it('should retrieve format given commit message for a monorepo package', async () => {
      mockYarnMonorepoDir();
      mockYarnWorkspacesInfoCmd(mockPackageName, mockMonorepoPackageDirName);

      const commitMessageType = 'feat';
      const commitMessage = 'test commit message';

      const result = await service.formatCommitMessage(
        mockMonorepoPackageDirPath,
        commitMessageType,
        commitMessage
      );

      expect(result).toEqual('feat(test-project): test commit message');
    });
  });
});
