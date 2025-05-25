import ExtString from '@utils/ExtString';
import chalk, { ChalkInstance } from 'chalk';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { sprintf } from 'sprintf-js';

// Base interface for all console options
interface BaseConsoleOptions {
  dir: string;
}

// Interface for template parameters
interface BaseTemplateParams {
  className: string;
  [key: string]: any;
}

abstract class BaseConsole<
  TOptions extends BaseConsoleOptions = BaseConsoleOptions,
  TTemplateParams extends BaseTemplateParams = BaseTemplateParams
> {
  protected readonly log: ((...args: any[]) => void);
  protected readonly chalk: ChalkInstance;
  protected accessor command: Command;
  protected readonly consoleTime: number = Date.now();

  // Console command
  protected accessor consoleName: string;
  protected abstract accessor options: TOptions;
  protected accessor destFileContent: string;
  protected accessor templateParams: TTemplateParams;

  constructor() {
    this.log = console.log;
    this.chalk = chalk;
    this.command = new Command();
  }

  public async preProcess(): Promise<void> {
    try {
      this.initCommand();
      this.parseCommand();

      // Check if the command has the required arguments
      this.consoleName = this.command.args[0]!;

      // Set the options from the command line arguments
      this.options = this.command.opts();

      const templatePath = this.retrieveTemplateFile();
      const templateContent = await this.fetchTemplateContent(templatePath);

      this.setTemplateParams();
      this.destFileContent = this.generateDestinationFileContent(templateContent);
    } catch (error) {
      this.exitWithError(`Failed to preprocess command: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  protected abstract initCommand(): void;
  protected abstract setTemplateParams(): void;
  abstract main(): Promise<void>;

  protected retrieveTemplateFile(): string {
    return path.join(__dirname, 'templates', 'create.tpl');
  }

  protected async getDestinationDir(): Promise<string> {
    const dir = this.options.dir;

    // Validate directory path to prevent directory traversal
    const normalizedPath = path.normalize(dir);
    if (normalizedPath.includes('..')) {
      this.exitWithError('Invalid directory path: directory traversal not allowed');
    }

    try {
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }
      return dir;
    } catch (error) {
      this.exitWithError(`Failed to create directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  protected getDestinationFileName(isMigration = false): string {
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(this.consoleName)) {
      this.exitWithError('File name must start with an uppercase letter and contain only alphanumeric characters');
    }

    if (!isMigration) return `${this.consoleName}.ts`;

    return `${this.consoleTime}-${ExtString.toKebabCase(this.consoleName)}.ts`;
  }

  protected printLog(message: string): void {
    this.log(this.chalk.blue(message));
  }

  protected printSuccess(message: string): void {
    this.log(this.chalk.green(message));
  }

  protected exitWithError(message: string): never {
    this.command.error(this.chalk.red(`Error: ${message}`));
    process.exit(1);
  }

  protected printWarning(message: string): void {
    this.log(this.chalk.yellow(message));
  }

  /**
   * Common method to create a file from template with standard error handling
   * @param fileTypeName - The type of file being created (e.g., 'migration', 'entity')
   * @param isMigration - Whether this is a migration file (affects filename generation)
   */
  protected async createFileFromTemplate(fileTypeName: string, isMigration = false): Promise<void> {
    try {
      this.printLog(`Creating ${fileTypeName} file...`);

      const destinationDir = await this.getDestinationDir();
      const fileName = this.getDestinationFileName(isMigration);
      const filePath = path.join(destinationDir, fileName);

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        this.exitWithError(`${fileTypeName.charAt(0).toUpperCase() + fileTypeName.slice(1)} file already exists: ${fileName}`);
      }

      await fs.promises.writeFile(filePath, this.destFileContent, 'utf-8');

      this.printSuccess(`${fileTypeName.charAt(0).toUpperCase() + fileTypeName.slice(1)} file created: ${fileName}`);
    } catch (error) {
      this.exitWithError(`Failed to create ${fileTypeName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseCommand(): void {
    this.command.parse(process.argv.slice(1));
  }

  private async fetchTemplateContent(templateFilePath: string): Promise<string> {
    // Validate template file path
    const normalizedPath = path.normalize(templateFilePath);
    if (normalizedPath.includes('..')) {
      this.exitWithError('Invalid template path: directory traversal not allowed');
    }

    try {
      if (!fs.existsSync(templateFilePath)) {
        this.exitWithError(`Template file not found: ${templateFilePath}`);
      }
      return await fs.promises.readFile(templateFilePath, 'utf-8');
    } catch (error) {
      this.exitWithError(`Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateDestinationFileContent(templateContent: string): string {
    try {
      return sprintf(templateContent, this.templateParams);
    } catch (error) {
      this.exitWithError(`Failed to generate file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default BaseConsole;
export type { BaseConsoleOptions, BaseTemplateParams };
