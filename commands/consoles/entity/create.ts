import BaseConsole, { BaseConsoleOptions, BaseTemplateParams } from '@console/BaseConsole';
import path from 'path';
import { plural } from 'pluralize';

interface EntityCreationProps extends BaseConsoleOptions {
  name: string;
}

interface EntityTemplateParams extends BaseTemplateParams {
  tableName: string;
}

class EntityCreateConsole extends BaseConsole<EntityCreationProps, EntityTemplateParams> {
  protected accessor options: EntityCreationProps;

  public constructor() {
    super();
  }

  protected initCommand(): void {
    this.command
      .description('Create a new entity file')
      .argument('<name>', 'Name of the entity file')
      .option('-d, --dir <directory>', 'Directory to create the entity file in', 'src/entities');
  }

  protected setTemplateParams(): void {
    this.templateParams = {
      className: this.consoleName,
      tableName: plural(this.consoleName).toLowerCase(),
    };
  }

  protected retrieveTemplateFile(): string {
    return path.join(__dirname, 'templates', 'create.tpl');
  }

  async main(): Promise<void> {
    await this.createFileFromTemplate('entity');
  }
}

export default EntityCreateConsole;
