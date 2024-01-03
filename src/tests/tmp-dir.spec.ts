import { stat, readdir, access } from "fs/promises";
import { resolve } from "path";

import { createTmpDir } from "./tmp-dir";

describe("tmp-dir", () => {
  describe("createTmpDir", () => {
    it("should create a tmp directory filled by test dir", async () => {
      const tmpDir = await createTmpDir("test-react-project");

      expect((await stat(tmpDir.name)).isDirectory()).toBe(true);
      expect((await stat(resolve(tmpDir.name, "package.json"))).isFile()).toBe(true);

      tmpDir.removeCallback();

      // Wait for the callback to be finished
      await new Promise((resolve) => setTimeout(resolve, 100));

      await expect(access(tmpDir.name)).rejects.toThrow("ENOENT: no such file or directory");
    });

    it("should create an empty tmp directory", async () => {
      const tmpDir = await createTmpDir();

      expect((await stat(tmpDir.name)).isDirectory()).toBe(true);
      expect(await readdir(tmpDir.name)).toHaveLength(0);

      tmpDir.removeCallback();

      // Wait for the callback to be finished
      await new Promise((resolve) => setTimeout(resolve, 100));

      await expect(access(tmpDir.name)).rejects.toThrow("ENOENT: no such file or directory");
    });
  });
});
