import { resolve } from "path";

import { copy } from "fs-extra";
import { DirResult, dir, setGracefulCleanup } from "tmp";

export { DirResult };

function getTmpDir(copyTestDir: string | null): Promise<DirResult> {
  return new Promise((resolve, reject) => {
    dir(
      {
        prefix: "reactionable-cli" + (copyTestDir ? "-" + copyTestDir : ""),
        unsafeCleanup: true,
        keep: false,
      },
      (err, name, removeCallback) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            name,
            removeCallback,
          });
        }
      }
    );
  });
}

export async function createTmpDir(copyTestDir: string | null = null): Promise<DirResult> {
  setGracefulCleanup();

  const tmpDir = await getTmpDir(copyTestDir);

  if (copyTestDir) {
    const testDirPath = resolve("__tests__", copyTestDir);
    await copy(testDirPath, tmpDir.name);
  }

  return tmpDir;
}
