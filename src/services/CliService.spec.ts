import container from "../container";
import { CliService } from "./CliService";

describe("cliService", () => {
  let service: CliService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    service = container.get(CliService);
  });

  afterEach(() => {
    container.restore();
  });

  describe("execCmd", () => {
    it("should execute a command", async () => {
      const result = await service.execCmd("echo 'ok'", undefined, true);
      expect(result).toEqual("\nok\n");
    });

    it("should throw an error if command args are empty", async () => {
      await expect(service.execCmd([])).rejects.toThrow("Command args must not be empty");
    });

    it("should throw an error if directory does not exist", async () => {
      await expect(service.execCmd("echo", "non-existing-dir")).rejects.toThrow(
        'Directory "non-existing-dir" does not exist'
      );
    });
  });

  describe("initRunStartDate", () => {
    it("should initialize a new run start date", async () => {
      const runStartDate = service.initRunStartDate();
      expect(runStartDate).toBeInstanceOf(Date);
    });
  });

  describe("getRunStartDate", () => {
    it("should retrieve the initialized run start date", async () => {
      const runStartDate = service.initRunStartDate();

      expect(service.getRunStartDate()).toEqual(runStartDate);
    });
  });
});
