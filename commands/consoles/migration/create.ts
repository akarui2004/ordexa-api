import BaseConsole from '@console/BaseConsole';
import ExtString from '@utils/ExtString';
import fs from 'fs';
import path from 'path';
import { sprintf } from 'sprintf-js';

interface MigrationCreationProps {
  name: string;
  dir: string;
  table?: string | boolean;
}

class MigrationCreateConsole extends BaseConsole {
  private accessor migrationName: string = '';
  private accessor options: MigrationCreationProps;

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
   * This method is used to retrieve the template file based on the options
   *
   * @returns {string} - The path to the template file
   * @throws {Error} - If the template file does not exist
   */
  private retrieveTemplateFile(): string {
    if (!this.options.table && this.options.table !== false) {
      this.exitWithError('Invalid table option. It should be either a string or false.');
    }
    const migrationTemplateFile = this.options.table === false ? 'create-without-table.tpl' : 'create-with-table.tpl';
    return path.join(__dirname, 'templates', migrationTemplateFile);
  }

  /**
   * This method is used to fetch the content of the template file
   *
   * @param templateFilePath - The path to the template file
   * @returns {string} - The content of the template file
   * @throws {Error} - If the template file does not exist
   */
  private fetchTemplateContent(templateFilePath: string): string {
    if (!fs.existsSync(templateFilePath)) {
      this.exitWithError(`Template file not found: ${templateFilePath}`);
    }
    return fs.readFileSync(templateFilePath, 'utf-8');
  }

  /**
   * This method is used to generate the content of the migration file
   *
   * @returns {string} - The content of the migration file
   * @throws {Error} - If the template file does not exist
   */
  private generateMigrationFileContent(): string {
    const templateFilePath = this.retrieveTemplateFile();
    const migrationTemplateContent = this.fetchTemplateContent(templateFilePath);

    const templateParams = {
      className: this.migrationName,
      tableName: this.options.table,
      existed: true,
      timestamp: this.consoleTime,
    }

    return sprintf(migrationTemplateContent, templateParams);
  }

  /**
   * This method is used to get the migration directory
   *
   * @returns {string} - The migration directory path
   * @throws {Error} - If the directory does not exist and cannot be created
   */
  private getMigrationDir(): string {
    const migrationDir = this.options.dir;
    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
    }

    return migrationDir;
  }

  /**
   * This method is used to get the migration file name
   *
   * @returns {string} - The migration file name
   */
  private getMigrationFileName(): string {
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(this.migrationName)) {
      this.exitWithError('Migration name must start with an uppercase letter and contain only alphanumeric characters');
    }
    return `${this.consoleTime}-${ExtString.toKebabCase(this.migrationName)}.ts`;
  }

  async main(): Promise<void> {
    this.printLog('Creating migration file...');

    this.options = this.command.opts();
    this.migrationName = this.command.args[0]!;

    const migrationContent = this.generateMigrationFileContent();

    const migrationDir = this.getMigrationDir();
    const migrationFile = this.getMigrationFileName();

    const migrationFilePath = path.join(migrationDir, migrationFile);
    fs.writeFileSync(migrationFilePath, migrationContent, 'utf-8');

    this.printSuccess(`Migration file created: ${migrationFile}`);
  }
}

export default MigrationCreateConsole;
