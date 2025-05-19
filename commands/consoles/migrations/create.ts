import BaseConsole from '../BaseConsole';

class MigrationCreateConsole extends BaseConsole {
  constructor() {
    super();
  }

  async main(): Promise<void> {
    console.log('MigrationCreateConsole main');
  }
}
