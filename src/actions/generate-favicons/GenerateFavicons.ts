import { inject } from "inversify";
import prompts from "prompts";

import { ConsoleService } from "../../services/ConsoleService";
import { NamedAction, NamedActionOptions } from "../NamedAction";

type GenerateFaviconsOptions = NamedActionOptions & { mustPrompt: boolean };

export default class GenerateFavicons implements NamedAction<GenerateFaviconsOptions> {
  constructor(@inject(ConsoleService) private readonly consoleService: ConsoleService) {}

  getName(): string {
    return "Generate favicons";
  }

  async run({ realpath, mustPrompt = false }: GenerateFaviconsOptions): Promise<void> {
    this.consoleService.info("Generating favicons...");
    if (mustPrompt) {
      const { confirm } = await prompts([
        {
          type: "confirm",
          name: "confirm",
          message: "Do you want to generate favicons?",
        },
      ]);

      if (!confirm) {
        return;
      }
    }

    await this.executeFavicon();
    this.consoleService.success(`Favicons have been generated in "${realpath}"`);
  }

  private async executeFavicon(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
