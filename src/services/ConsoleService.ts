import { injectable } from 'inversify';
import { yellow, green, red } from 'chalk';

@injectable()
export class ConsoleService {
  info(message: string) {
    process.stdout.write('\n' + yellow('→ ') + message + '\n');
  }

  success(message: string) {
    process.stdout.write(green('✓ ') + message + '\n');
  }

  error(error: Error | string) {
    if (typeof error === 'string') {
      process.stderr.write('\n' + red(`⚠ ${error}`) + '\n');
      return;
    }
    process.stderr.write(
      '\n' +
        red(`⚠ [${error.name}] ${error.message}`) +
        '\n' +
        error.stack +
        '\n'
    );
  }
}
