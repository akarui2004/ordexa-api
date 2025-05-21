import chalk, { ChalkInstance } from 'chalk';
import { Command } from 'commander';

abstract class BaseConsole {
  protected readonly arguments: string[] = [];
  protected readonly log: ((...args: any[]) => void);
  protected readonly chalk: ChalkInstance;
  protected accessor command: Command;
  protected readonly consoleTime: number = Date.now();

  constructor() {
    this.log = console.log;
    this.chalk = chalk;
    this.command = new Command();
    this.initCommand();
    this.parseCommand();
  }

  public setArguments(args: string[]): void {
    this.arguments.splice(0, this.arguments.length, ...args);
  }

  private parseCommand(): void {
    this.command.parse(process.argv.slice(1));
  }

  protected printLog(message: string): void {
    this.log(this.chalk.blue(message));
  }

  protected printSuccess(message: string): void {
    this.log(this.chalk.green(message));
  }

  protected exitWithError(message: string): void {
    this.command.error(this.chalk.red(`Error: ${message}`));
  }

  protected abstract initCommand(): void;
  abstract main(): Promise<void>;
}

export default BaseConsole;
