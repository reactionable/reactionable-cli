import prompts from "prompts";
import { afterEach, describe, expect, it, vi } from "vitest";

import Netlify from "./Netlify";

vi.mock("prompts", () => {
    const promptsFn = vi.fn();
    (promptsFn as any).inject = vi.fn();
    return { default: promptsFn };
});

describe("Netlify", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should reuse an existing site when the git remote already matches a configured Netlify app", async () => {
        const netlify = Object.create(Netlify.prototype);
        const netlifyFile = {
            appendContent: vi.fn(),
            saveFile: vi.fn().mockResolvedValue(undefined),
        };
        const consoleService = { success: vi.fn(), error: vi.fn() };
        Object.defineProperty(netlify, "fileFactory", {
            value: { fromFile: vi.fn().mockResolvedValue(netlifyFile) },
            configurable: true,
        });
        Object.defineProperty(netlify, "templateService", {
            value: {
                renderTemplateFile: vi.fn().mockResolvedValue("template-body"),
            },
            configurable: true,
        });
        Object.defineProperty(netlify, "packageManagerService", {
            value: { getPackageName: vi.fn().mockResolvedValue("demo-app") },
            configurable: true,
        });
        Object.defineProperty(netlify, "gitService", {
            value: {
                getGitCurrentBranch: vi.fn().mockResolvedValue("main"),
                getGitRemoteOriginUrl: vi.fn().mockResolvedValue(
                    "https://github.com/acme/demo",
                ),
            },
            configurable: true,
        });
        Object.defineProperty(netlify, "cliService", {
            value: {
                getGlobalCmd: vi.fn().mockReturnValue("netlify"),
                execCmd: vi.fn(),
                getNodeVersion: vi.fn().mockReturnValue("20"),
            },
            configurable: true,
        });
        Object.defineProperty(netlify, "consoleService", {
            value: consoleService,
            configurable: true,
        });
        vi.mocked(prompts).mockResolvedValue({ projectName: "demo-app" });
        const execNetlifyCmd = vi
            .spyOn(netlify as any, "execNetlifyCmd")
            .mockImplementation(async (args: string[]) => {
                if (args[0] === "api") {
                    return JSON.stringify([
                        {
                            name: "demo-app",
                            build_settings: { repo_url: "https://github.com/acme/demo" },
                        },
                    ]);
                }
                return "ok";
            });

        await netlify.run({ realpath: "/tmp/project" });

        expect(netlifyFile.appendContent).toHaveBeenCalledWith("template-body");
        expect(netlifyFile.saveFile).toHaveBeenCalled();
        expect(execNetlifyCmd).toHaveBeenCalledWith(
            ["api", "listSites", "--data", expect.any(String)],
            "/tmp/project",
            true,
        );
        expect(consoleService.success).toHaveBeenCalledWith(
            'Netlify is already configured for site "demo-app"',
        );
    });
});
