import chalk, { ChalkInstance } from 'chalk';

abstract class BaseConsole {
  protected readonly arguments: string[];
  protected readonly log: ((...args: any[]) => void);
  protected readonly chalk: ChalkInstance;

  constructor() {
    this.arguments = process.argv;
    this.log = console.log;
    this.chalk = chalk;
  }

  abstract main(): Promise<void>;
}

export default BaseConsole;
