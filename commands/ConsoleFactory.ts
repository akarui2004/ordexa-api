import path from 'path';
import BaseConsole from './consoles/BaseConsole';

class ConsoleFactory {
  private static commandMaps: { [key: string]: new () => BaseConsole } = {};

  private static async initCommandMap(): Promise<void> {
    // Dynamically import all console classes
    const consoleDirs = path.join(__dirname, 'consoles');
    const args = process.argv.slice(2);
    // const consolePath = path.join(consoleDirs, consoleName);
    console.log('args', args);
    console.log('consoleDirs', consoleDirs);
  }

  public static async createConsole() {
    if (Object.keys(this.commandMaps).length === 0) {
      await this.initCommandMap();
    }
  }
}

export default ConsoleFactory;
