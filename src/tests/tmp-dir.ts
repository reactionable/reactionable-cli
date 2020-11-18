import { resolve } from 'path';

import { copySync } from 'fs-extra';
import { DirResult, dirSync, setGracefulCleanup } from 'tmp';

export { DirResult };

export function createTmpDir(copyTestDir = true): DirResult {
  setGracefulCleanup();
  const tmpDir = dirSync({
    prefix: 'reactionable-cli',
    unsafeCleanup: true,
  });

  if (copyTestDir) {
    const testDirPath = resolve('__tests__/test-project');
    copySync(testDirPath, tmpDir.name);
  }

  return tmpDir;
}
