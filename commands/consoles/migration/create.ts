import { spawn } from 'child_process';
import BaseConsole from '../BaseConsole';
import ExtString from '../../../src/utils/ExtString';

class MigrationCreateConsole extends BaseConsole {
  constructor() {
    super();
  }

  async main(): Promise<void> {
    this.log(this.chalk.blue('Migration create console is running...'));

    const migrationName = this.arguments[0];
    if (!migrationName) throw new Error('Migration name is required.');

    const migrationFilePath = `src/migrations/${ExtString.toKebabCase(migrationName)}`;

    const cmd = 'npx';
    const args = [
      'typeorm',
      'migration:create',
      migrationFilePath,
    ];

    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', shell: true });

        child.on('error', (error) => {
          reject(error);
        });

        child.on('close', (code) => {
          if (code === 0) {
            this.log(this.chalk.green('Migration created successfully.'));
            resolve();
          } else {
            reject(new Error(`Migration creation failed with code: ${code}`));
          }
        });
      });
    } catch (error: any) {
      this.log(this.chalk.red('Error:', error?.message || error));
    }
  }
}

export default MigrationCreateConsole;