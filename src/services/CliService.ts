import { spawn } from "child_process";

import { Change } from "diff";
import { inject } from "inversify";
import prompts from "prompts";
import shelljs from "shelljs";

import { ConsoleService } from "./ConsoleService";
import { DirectoryService } from "./file/DirectoryService";
import { ColorService } from "./ColorService";

export enum PromptOverwriteChoice {
  DIFF = "diff",
  OVERWRITE = "overwrite",
  CANCEL = "cancel",
}

export class CliService {
  private runStartDate: Date | undefined;

  constructor(
    @inject(DirectoryService) private readonly directoryService: DirectoryService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(ColorService) private readonly colorService: ColorService
  ) {}

  getRunStartDate(): Date | undefined {
    return this.runStartDate;
  }

  initRunStartDate(): Date {
    return (this.runStartDate = new Date());
  }

  getCmd(cmd: string): string | null {
    if (shelljs.which(cmd)) {
      return cmd;
    }
    return null;
  }

  async execCmd(args: string | string[], cwd?: string, silent = false): Promise<string> {
    if (!args.length) {
      throw new Error("Command args must not be empty");
    }

    if (cwd && !(await this.directoryService.dirExists(cwd))) {
      throw new Error(`Directory "${cwd}" does not exist`);
    }

    let cmd: string;
    if (Array.isArray(args)) {
      cmd = args.shift() || "";
    } else {
      cmd = args;
      args = [];
    }

    return new Promise((resolve, reject) => {
      const child = spawn(cmd, args as string[], {
        stdio: silent ? "pipe" : "inherit",
        shell: true,
        windowsVerbatimArguments: true,
        cwd,
      });

      let output = "";
      let error = "";

      child.on("exit", function (code) {
        if (code) {
          return reject(error);
        }
        resolve(output);
      });

      if (child.stdout) {
        child.stdout.on("data", (data) => {
          output += `\n${data}`;
        });
      }
      if (child.stderr) {
        child.stderr.on("data", (data) => {
          error += `\n${data}`;
        });
      }
    });
  }

  async promptToContinue(message: string, question: string): Promise<boolean> {
    const { shouldContinue } = await prompts([
      {
        type: "confirm",
        name: "shouldContinue",
        message: `${message}, ${this.colorService.red(question)}`,
      },
    ]);

    return shouldContinue;
  }

  async promptToChoose<Choice>(message: string, choices: Record<string, Choice>): Promise<Choice> {
    const { choice } = await prompts([
      {
        name: "choice",
        message,
        type: "select",
        choices: Object.entries(choices).map(([title, value]) => ({
          title,
          value,
        })),
      },
    ]);

    return choice;
  }

  async promptOverwriteFileDiff(file: string, diff: Change[]): Promise<boolean> {
    const hasDiff = diff.some((part) => part.added !== undefined || part.removed !== undefined);
    if (!hasDiff) {
      return false;
    }

    const shouldPrompt = true;
    while (shouldPrompt) {
      const action = await this.promptToChoose(
        `File "${file}" exists already, what do you want to do?`,
        {
          "Show diff": PromptOverwriteChoice.DIFF,
          "Overwrite file": PromptOverwriteChoice.OVERWRITE,
          "Keep original file": PromptOverwriteChoice.CANCEL,
        }
      );

      if (action === PromptOverwriteChoice.CANCEL) {
        return false;
      }

      if (action === PromptOverwriteChoice.OVERWRITE) {
        return true;
      }

      // Compare diff
      let diffMessage = `File ${file} diff:\n-----------------------------------------------\n`;
      for (const part of diff) {
        // green for additions, red for deletions
        // grey for common parts
        const isSpaces = !!part.value.match(/^[\r\n\s]+$/);
        const value = part.value === "\n" ? " ".repeat(process.stdout.columns) : part.value;

        let coloredValue: string;
        switch (true) {
          case !!part.added:
            coloredValue = isSpaces
              ? this.colorService.greenBright(value)
              : this.colorService.greenBright(value);
            break;
          case !!part.removed:
            coloredValue = isSpaces
              ? this.colorService.greenBright(value)
              : this.colorService.redBright(value);
            break;
          default:
            coloredValue = this.colorService.gray(value);
            break;
        }

        diffMessage += coloredValue;
      }

      diffMessage += "\n-----------------------------------------------\n";

      this.consoleService.info(diffMessage);
      await this.pause();
    }
    return false;
  }

  getNodeVersion(): string {
    const nodeVersionMatch = process.version.match(/^v(\d+\.\d+)/);

    if (!nodeVersionMatch) {
      throw new Error("Unable to retrieve node version");
    }
    return nodeVersionMatch[1];
  }

  getGlobalCmd(cmd: string): string | null {
    if (this.getCmd(cmd)) {
      return cmd;
    }
    if (this.getCmd("npx")) {
      return `npx ${cmd}`;
    }
    return null;
  }

  async upgradeGlobalPackage(packageName: string): Promise<void> {
    const outdatedInfo = await this.execCmd(
      ["npm", "outdated", "-g", packageName, "--json", "||", "true"],
      undefined,
      true
    );

    if (outdatedInfo) {
      const outdatedData = JSON.parse(outdatedInfo);
      if (
        outdatedData[packageName]?.current &&
        outdatedData[packageName].current !== outdatedData[packageName].latest
      ) {
        await this.execCmd(["npm", "install", "-g", packageName], undefined);
      }
    }
  }

  private pause(message = "Press any key to continue...") {
    return new Promise((resolve, reject) => {
      try {
        this.consoleService.info(message);
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on("data", resolve);
      } catch (error) {
        reject(error);
      }
    });
  }
}
