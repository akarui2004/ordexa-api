import fs from 'fs';
import path from 'path';
import BaseConsole from './consoles/BaseConsole';

type ConsoleClass = new () => BaseConsole;

class ConsoleFactory {
  private static commandRegistry: Record<string, ConsoleClass> = {};

  // This method is used to get the console directory path
  private static getConsoleDir(): string {
    return path.join(__dirname, 'consoles');
  }

  // This method is used to get the console arguments from the command line
  private static getArgs(): string[] {
    return process.argv.slice(2);
  }

  // This method is used to resolve the class file path based on the command
  private static resolveClassFilePath(command: string): string {
    return path.join(this.getConsoleDir(), command.replaceAll(':', path.sep));
  }

  // This method is used to find the console file based on the command
  private static findConsoleFile(command: string): string {
    const basePath = this.resolveClassFilePath(command);
    const candidateFiles = [`${basePath}.ts`, `${basePath}.js`];
    for (const file of candidateFiles) {
      if (fs.existsSync(file)) return file;
    }
    throw new Error(`Console file not found for command: ${command}`);
  }

  // This method is used to load the console class from the file
  // It imports the file and checks if the default export is a function
  private static async loadConsoleClass(command: string): Promise<ConsoleClass> {
    const filePath = this.findConsoleFile(command);
    const module = await import(filePath);
    const consoleClass = module.default;
    if (typeof consoleClass !== 'function') throw new Error(`Console class not found in file: ${filePath}`);
    return consoleClass as ConsoleClass;
  }

  // This method is used to create a console instance
  // It checks if the command is already registered
  // If not, it loads the console class and creates an instance
  public static async execConsole() {
    const args = this.getArgs();
    if (!args[0]) throw new Error('No console command provided');
    const command = args[0];

    if (!this.commandRegistry[command]) {
      this.commandRegistry[command] = await this.loadConsoleClass(command);
    }

    const consoleCtor = this.commandRegistry[command];
    const _instance = new consoleCtor();

    if (typeof _instance.main !== 'function') throw new Error(`Console class does not have a main method: ${command}`);
    _instance.setArguments(args.slice(1)); // Pass the rest of the arguments to the console instance
    await _instance.main();
  }
}

export default ConsoleFactory;
