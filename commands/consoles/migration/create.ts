import BaseConsole, { BaseConsoleOptions, BaseTemplateParams } from '@console/BaseConsole';
import path from 'path';

interface MigrationCreationProps extends BaseConsoleOptions {
  name: string;
  table?: string | boolean;
}

interface MigrationTemplateParams extends BaseTemplateParams {
  tableName: string | boolean;
  existed: boolean;
  timestamp: number;
}

class MigrationCreateConsole extends BaseConsole<MigrationCreationProps, MigrationTemplateParams> {
  protected accessor options: MigrationCreationProps;

  public constructor() {
    super();
  }

  protected initCommand(): void {
    this.command
      .description('Create a new migration file')
      .argument('<name>', 'Name of the migration file')
      .option('-t, --table <table>', 'Table name to create the migration for')
      .option('--no-table', 'Do not create a table migration')
      .option('-d, --dir <directory>', 'Directory to create the migration file in', 'src/migrations');
  }

  /**
   * This method is used to set the template parameters for the migration file
   */
  protected setTemplateParams(): void {
    this.templateParams = {
      className: this.consoleName,
      tableName: this.options.table ?? false,
      existed: true,
      timestamp: this.consoleTime,
    };
  }

  /**
   * This method is used to retrieve the template file based on the options
   *
   * @returns {string} - The path to the template file
   * @throws {Error} - If the template file does not exist
   */
  protected retrieveTemplateFile(): string {
    // Normalize table option logic
    const hasTable = this.options.table !== false && this.options.table !== undefined;
    const migrationTemplateFile = hasTable ? 'create-with-table.tpl' : 'create-without-table.tpl';
    return path.join(__dirname, 'templates', migrationTemplateFile);
  }

  async main(): Promise<void> {
    await this.createFileFromTemplate('migration', true);
  }
}

export default MigrationCreateConsole;
