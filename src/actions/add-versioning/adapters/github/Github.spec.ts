import container from '../../../../container';
import Github from './Github';

describe('Github', () => {
  let github: Github;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    github = container.get(Github);
  });

  describe('validateGitRemote', () => {
    it('should retrieve parsed url data when given url is a valid github url', () => {
      const url = 'git@github.com:test/test.git';

      const parsedUrl = github.validateGitRemote(url);

      expect(parsedUrl).toMatchObject({
        auth: null,
        branch: 'master',
        filepath: null,
        hash: null,
        host: 'github.com',
        hostname: null,
        href: 'git@github.com:test/test.git',
        name: 'test',
        owner: 'test',
        path: 'git@github.com:test/test.git',
        pathname: 'git@github.com:test/test.git',
        port: null,
        protocol: null,
        query: null,
        repo: 'test/test',
        repository: 'test/test',
        search: null,
        slashes: null,
      });
    });

    it('should retrieve an error message when a given url is not a valid github url', () => {
      const url = '';

      const parsedUrl = github.validateGitRemote(url);

      expect(parsedUrl).toEqual('Could not parse Git remote from given url ""');
    });
  });
});
