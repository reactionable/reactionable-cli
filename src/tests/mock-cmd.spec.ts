import { describe, it, expect, afterEach } from "@jest/globals";
import { getMockSpawn, mockYarnCmd, mockYarnBinCmd, restoreMockCmd } from "./mock-cmd";

describe("mock-cmd", () => {
  afterEach(() => {
    restoreMockCmd();
  });

  describe("getMockSpawn", () => {
    it("should return the mock spawn instance", () => {
      mockYarnCmd();
      const spawn = getMockSpawn();
      expect(spawn).toBeDefined();
      expect(typeof spawn).toBe("function");
    });
  });

  describe("mockYarnBinCmd", () => {
    it("should mock yarn bin command with correct path", () => {
      const mockDirPath = "/test/path";
      const cmdMock = mockYarnBinCmd(mockDirPath);
      
      expect(cmdMock).toBeDefined();
      expect(cmdMock.mockResult).toBeDefined();
      expect(cmdMock.mockError).toBeDefined();
    });
  });
});
