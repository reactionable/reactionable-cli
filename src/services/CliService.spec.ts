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
