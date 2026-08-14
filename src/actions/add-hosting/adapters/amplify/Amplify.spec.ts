import prompts from "prompts";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../container", () => ({
    default: {
        get: vi.fn(),
        getAll: vi.fn(),
    },
    ActionIdentifier: Symbol("ActionIdentifier"),
    CreateAppIdentifier: Symbol("CreateAppIdentifier"),
    AddUIFrameworkIdentifier: Symbol("AddUIFrameworkIdentifier"),
    AddHostingIdentifier: Symbol("AddHostingIdentifier"),
    AddRouterIdentifier: Symbol("AddRouterIdentifier"),
}));

vi.mock("../../../actions/container", () => ({
    ActionIdentifier: Symbol("ActionIdentifier"),
    CreateAppIdentifier: Symbol("CreateAppIdentifier"),
    AddUIFrameworkIdentifier: Symbol("AddUIFrameworkIdentifier"),
    AddHostingIdentifier: Symbol("AddHostingIdentifier"),
    AddRouterIdentifier: Symbol("AddRouterIdentifier"),
    bindActions: vi.fn(),
}));

vi.mock("prompts", () => {
    const promptsFn = vi.fn();
    (promptsFn as any).inject = vi.fn();
    return { default: promptsFn };
});

import Amplify from "./Amplify";

describe("Amplify", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should install the Amplify package and patch the generated app files for a configured project", async () => {
        const amplify = Object.create(Amplify.prototype);
        const appFile = {
            setImports: vi.fn().mockReturnThis(),
            replaceContent: vi.fn().mockReturnThis(),
            saveFile: vi.fn().mockResolvedValue(undefined),
        };
        const entrypointFile = {
            setImports: vi.fn().mockReturnThis(),
            appendContent: vi.fn().mockReturnThis(),
            saveFile: vi.fn().mockResolvedValue(undefined),
        };
        const i18nFile = {
            setImports: vi.fn().mockReturnThis(),
            saveFile: vi.fn().mockResolvedValue(undefined),
        };
        const projectConfig = {
            getData: vi.fn().mockReturnValue({ projectName: "demoProject" }),
        };
        const backendConfig = {
            getData: vi.fn().mockReturnValue({
                auth: {
                    authProvider: { service: "Cognito", providerPlugin: "awscloudformation" },
                },
                api: {
                    apiProvider: { service: "AppSync", providerPlugin: "awscloudformation" },
                },
                hosting: {
                    amplifyhosting: {
                        service: "amplifyhosting",
                        providerPlugin: "awscloudformation",
                        type: "manual",
                    },
                },
            }),
        };
        const consoleService = { info: vi.fn(), success: vi.fn(), error: vi.fn() };
        Object.defineProperty(amplify, "createApp", {
            value: {
                detectAdapter: vi.fn().mockResolvedValue({
                    getAppFilePath: () => "src/App.tsx",
                    getEntrypointFilePath: () => "src/index.tsx",
                    getLibDirectoryPath: () => "src",
                }),
            },
            configurable: true,
        });
        Object.defineProperty(amplify, "packageManagerService", {
            value: {
                getPackageName: vi.fn().mockResolvedValue("demoProject"),
                getPackageManagerCmd: vi.fn().mockResolvedValue("npm"),
                installPackages: vi.fn().mockResolvedValue([]),
                updatePackageJson: vi.fn().mockResolvedValue(undefined),
            },
            configurable: true,
        });
        Object.defineProperty(amplify, "gitService", {
            value: { getGitCurrentBranch: vi.fn().mockResolvedValue("main") },
            configurable: true,
        });
        Object.defineProperty(amplify, "fileService", {
            value: {
                fileExists: vi.fn().mockImplementation(async (path: string) =>
                    path.endsWith("amplify/.config/project-config.json") ||
                    path.endsWith("amplify/backend/backend-config.json"),
                ),
            },
            configurable: true,
        });
        Object.defineProperty(amplify, "fileFactory", {
            value: {
                fromFile: vi.fn().mockImplementation(async (path: string) => {
                    if (path.endsWith("amplify/.config/project-config.json")) {
                        return projectConfig as any;
                    }
                    if (path.endsWith("amplify/backend/backend-config.json")) {
                        return backendConfig as any;
                    }
                    if (path.endsWith("src/App.tsx")) {
                        return appFile as any;
                    }
                    if (path.endsWith("src/index.tsx")) {
                        return entrypointFile as any;
                    }
                    if (path.endsWith("src/i18n/i18n.ts")) {
                        return i18nFile as any;
                    }
                    return { getData: vi.fn() } as any;
                }),
            },
            configurable: true,
        });
        Object.defineProperty(amplify, "templateService", {
            value: { renderTemplate: vi.fn().mockResolvedValue(undefined) },
            configurable: true,
        });
        Object.defineProperty(amplify, "cliService", {
            value: {
                getCmd: vi.fn().mockReturnValue("amplify"),
                getGlobalCmd: vi.fn().mockReturnValue("amplify"),
                execCmd: vi.fn().mockResolvedValue("ok"),
                upgradeGlobalPackage: vi.fn().mockResolvedValue(undefined),
            },
            configurable: true,
        });
        Object.defineProperty(amplify, "consoleService", {
            value: consoleService,
            configurable: true,
        });
        vi.spyOn(amplify as any, "execAmplifyCmd").mockResolvedValue("ok");
        vi.mocked(prompts).mockResolvedValue({ projectName: "demoProject" });

        await amplify.run({ realpath: "/tmp/project" });

        expect(amplify.templateService.renderTemplate).toHaveBeenCalled();
        expect(appFile.setImports).toHaveBeenCalled();
        expect(entrypointFile.setImports).toHaveBeenCalled();
        expect(entrypointFile.appendContent).toHaveBeenCalledWith(
            "Amplify.configure(awsconfig);",
            "import './index.scss';",
        );
        expect(i18nFile.setImports).toHaveBeenCalled();
        expect(amplify.packageManagerService.installPackages).toHaveBeenCalledWith(
            "/tmp/project",
            ["concurrently"],
            false,
            true,
        );
        expect(amplify.packageManagerService.updatePackageJson).toHaveBeenCalledWith(
            "/tmp/project",
            {
                scripts: {
                    start: 'concurrently "amplify mock" "yarn react-scripts start"',
                },
            },
        );
    });
});
