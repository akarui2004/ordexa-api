import { MigrationInterface, QueryRunner, Table, TableColumnOptions } from "typeorm";

export class %(className)s%(timestamp)s implements MigrationInterface {
  private readonly tableName = '%(tableName)s';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table(), %(existed)t);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, %(existed)t);
  }

  private table(): Table {
    return new Table({
      name: this.tableName,
      columns: this.tableColumns(),
    });
  }

  private tableColumns(): TableColumnOptions[] {
    return [
      { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid' },

      // define table column in here

      { name: 'deletedAt', type: 'timestamp', isNullable: true },
      { name: 'createdAt', type: 'timestamp', default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', default: 'now()' },
    ] as TableColumnOptions[];
  }
}
