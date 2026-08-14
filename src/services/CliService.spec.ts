import prompts from "prompts";
import shelljs from "shelljs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import container from "../container";
import { CliService } from "./CliService";

vi.mock("prompts", () => ({
	default: vi.fn(),
}));

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
			await expect(service.execCmd([])).rejects.toThrow(
				"Command args must not be empty",
			);
		});

		it("should throw an error if directory does not exist", async () => {
			await expect(service.execCmd("echo", "non-existing-dir")).rejects.toThrow(
				'Directory "non-existing-dir" does not exist',
			);
		});
	});

	describe("prompt helpers", () => {
		it("should confirm a user choice and pass the colorized question message", async () => {
			vi.mocked(prompts).mockResolvedValue({ shouldContinue: true });

			await expect(
				service.promptToContinue("Continue?", "confirm action"),
			).resolves.toBe(true);
		});

		it("should return the selected choice from the prompted menu", async () => {
			vi.mocked(prompts).mockResolvedValue({ choice: "overwrite" });

			await expect(
				service.promptToChoose("Which action?", {
					overwrite: "overwrite",
					cancel: "cancel",
				}),
			).resolves.toBe("overwrite");
		});
	});

	describe("utility helpers", () => {
		it("should resolve the direct command when the binary is installed", () => {
			vi.spyOn(shelljs, "which").mockImplementation((cmd) =>
				cmd === "vite" ? "/usr/bin/vite" : null,
			);

			expect(service.getGlobalCmd("vite")).toBe("vite");
		});

		it("should resolve the NPM fallback command when the direct binary is missing", () => {
			vi.spyOn(shelljs, "which").mockImplementation((cmd) =>
				cmd === "npx" ? "/usr/bin/npx" : null,
			);
		});

		it("should return the current major node version", () => {
			expect(service.getNodeVersion()).toMatch(/^\d+\.\d+$/);
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
