import { resolve } from 'path';

import { copySync } from 'fs-extra';
import { DirResult, dirSync, setGracefulCleanup } from 'tmp';

export { DirResult };

export function createTmpDir(copyTestDir: string | false = 'test-react-project'): DirResult {
  setGracefulCleanup();
  const tmpDir = dirSync({
    prefix: 'reactionable-cli' + (copyTestDir ? '-' + copyTestDir : ''),
    unsafeCleanup: true,
  });

  if (copyTestDir) {
    const testDirPath = resolve('__tests__', copyTestDir);
    copySync(testDirPath, tmpDir.name);
  }

  return tmpDir;
}
