import chalk, { ChalkInstance } from 'chalk';

abstract class BaseConsole {
  protected readonly arguments: string[] = [];
  protected readonly log: ((...args: any[]) => void);
  protected readonly chalk: ChalkInstance;

  constructor() {
    this.log = console.log;
    this.chalk = chalk;
  }

  public setArguments(args: string[]): void {
    this.arguments.splice(0, this.arguments.length, ...args);
  }

  abstract main(): Promise<void>;
}

export default BaseConsole;
