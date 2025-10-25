import { jest } from "@jest/globals";

import container from "../container";
import { ColorService } from "./ColorService";
import { ConsoleService } from "./ConsoleService";

describe("ConsoleService", () => {
  let consoleService: ConsoleService;
  let colorService: ColorService;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    consoleService = container.get(ConsoleService);
    colorService = container.get(ColorService);
  });

  afterEach(() => {
    container.restore();
  });

  describe("info", () => {
    it("should write an info message to stdout", () => {
      const message = "This is an info message";
      const expectedOutput = `\n${colorService.yellow("→ ")}${message}\n`;
      const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation();

      consoleService.info(message);

      expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
      writeSpy.mockRestore();
    });
  });

  describe("success", () => {
    it("should write a success message to stdout", () => {
      const message = "This is a success message";
      const expectedOutput = `${colorService.green("✓ ")}${message}\n`;
      const writeSpy = jest.spyOn(process.stdout, "write").mockImplementation();

      consoleService.success(message);

      expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
      writeSpy.mockRestore();
    });
  });

  describe("error", () => {
    it("should write a string error message to stderr", () => {
      const errorMessage = "This is a string error message";
      const expectedOutput = `\n${colorService.red(`⚠ ${errorMessage}`)}\n`;
      const writeSpy = jest.spyOn(process.stderr, "write").mockImplementation();

      consoleService.error(errorMessage);

      expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
      writeSpy.mockRestore();
    });

    it("should write an Error object to stderr", () => {
      const error = new Error("This is an error message");
      const expectedOutput = `\n${colorService.red(`⚠ [${error.name}] ${error.message}`)}\n${
        error.stack
      }\n`;
      const writeSpy = jest.spyOn(process.stderr, "write").mockImplementation();

      consoleService.error(error);

      expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
      writeSpy.mockRestore();
    });

    it("should write a JSON error message to stderr", () => {
      const error = { message: "This is a JSON error message" };
      const expectedOutput = `\n${colorService.red(`⚠ `)}${JSON.stringify(error)}\n`;
      const writeSpy = jest.spyOn(process.stderr, "write").mockImplementation();

      consoleService.error(error);

      expect(writeSpy).toHaveBeenCalledWith(expectedOutput);
      writeSpy.mockRestore();
    });
  });
});
