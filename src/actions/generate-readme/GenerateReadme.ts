import { inject, injectable } from 'inversify';
import prompts from 'prompts';

import { CliService } from '../../services/CliService';
import { ConsoleService } from '../../services/ConsoleService';
import { GitService } from '../../services/git/GitService';
import { NamedAction, NamedActionOptions } from '../NamedAction';

type GenerateReadmeOptions = NamedActionOptions & { mustPrompt: boolean };

@injectable()
export default class GenerateReadme implements NamedAction<GenerateReadmeOptions> {
  constructor(
    @inject(CliService) private readonly cliService: CliService,
    @inject(ConsoleService) private readonly consoleService: ConsoleService,
    @inject(GitService) private readonly gitService: GitService
  ) {}

  getName(): string {
    return 'Generate README.md file';
  }

  async run({ realpath, mustPrompt = false }: GenerateReadmeOptions): Promise<void> {
    this.consoleService.info('Generating README.md file...');
    if (mustPrompt) {
      const { override } = await prompts([
        {
          type: 'confirm',
          name: 'override',
          message: 'Do you want to generate the README file?',
        },
      ]);

      if (!override) {
        return;
      }
    }
    const readmeMdGeneratorCmd = this.cliService.getGlobalCmd('readme-md-generator');
    if (!readmeMdGeneratorCmd) {
      return this.consoleService.error(
        'Unable to generate README.md file, install globally "readme-md-generator" or "npx"'
      );
    }
    await this.cliService.execCmd([readmeMdGeneratorCmd, '-y'], realpath);
    this.consoleService.success(`README.md file has been generated in "${realpath}"`);

    if (!(await this.gitService.isAGitRepository(realpath))) {
      return;
    }

    await this.gitService.commitFiles(realpath, 'generate README.md file', 'chore');
  }
}
