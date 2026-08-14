import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../container", () => ({
    default: {
        get: vi.fn(),
        getAll: vi.fn(),
    },
}));

import container from "../container";

vi.mock("../actions/container", () => ({
    ActionIdentifier: Symbol("ActionIdentifier"),
    bindActions: vi.fn(),
}));

vi.mock("../services/CliService", () => ({
    CliService: class {
        initRunStartDate = vi.fn();
    },
}));

vi.mock("../services/ConsoleService", () => ({
    ConsoleService: class {
        error = vi.fn();
    },
}));

vi.mock("../services/package-manager/PackageManagerService", () => ({
    PackageManagerService: class {
        getPackageVersion = vi.fn().mockResolvedValue("1.2.3");
    },
}));

vi.mock("figlet", () => ({
    default: {
        textSync: vi.fn().mockReturnValue("Reactionable"),
    },
}));

vi.mock("clipanion", async () => {
    const actual = await vi.importActual<typeof import("clipanion")>("clipanion");
    return {
        ...actual,
        Builtins: {
            HelpCommand: class { },
            VersionCommand: class { },
        },
        Cli: class {
            constructor(public readonly options: Record<string, unknown> = {}) { }
            register(): void { }
            runExit(): void { }
        },
        defaultContext: {},
    };
});

import { Cli } from "./Cli";

describe("Cli", () => {
    const originalArgv = process.argv.slice();

    beforeEach(() => {
        process.argv = ["node", "reactionable"];
    });

    afterEach(() => {
        process.argv = originalArgv.slice();
        vi.restoreAllMocks();
    });

    it("should initialize the CLI and expose the package version", async () => {
        const cli = new Cli();
        vi.mocked(container.get).mockImplementation(() => ({
            getPackageVersion: vi.fn().mockResolvedValue("1.2.3"),
        }));
        await (cli as any).initialize();

        expect((cli as any).cli).toBeTruthy();
        expect(await (cli as any).getBinaryVersion()).toBe("1.2.3");
    });

    it("should pass the CLI arguments through to clipanion", async () => {
        const cli = new Cli();
        const runExit = vi.fn();
        vi.spyOn(cli as any, "initialize").mockResolvedValue();
        (cli as any).cli = { runExit };
        vi.mocked(container.get).mockImplementation(() => ({
            getPackageVersion: vi.fn().mockResolvedValue("1.2.3"),
        }));

        process.argv = ["node", "reactionable", "run", "--help"];
        await cli.run();

        expect(runExit).toHaveBeenCalledWith(["run", "--help"], expect.any(Object));
    });
});
