import { existsSync, readdirSync } from "fs";
import { resolve } from "path";

import { createTmpDir } from "./tmp-dir";

describe("tmp-dir", () => {
  describe("createTmpDir", () => {
    it("should create a tmp directory filled by test dir", () => {
      const tmpDir = createTmpDir();

      expect(existsSync(tmpDir.name)).toBe(true);
      expect(existsSync(resolve(tmpDir.name, "package.json"))).toBe(true);

      tmpDir.removeCallback();
      expect(existsSync(tmpDir.name)).toBe(false);
    });

    it("should create an empty tmp directory", () => {
      const tmpDir = createTmpDir(false);
      expect(existsSync(tmpDir.name)).toBe(true);
      expect(readdirSync(tmpDir.name)).toHaveLength(0);

      tmpDir.removeCallback();
      expect(existsSync(tmpDir.name)).toBe(false);
    });
  });
});
