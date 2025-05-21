import { MigrationInterface, QueryRunner, Table, TableColumnOptions } from "typeorm";

export class %(className)s implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table(), %(existed)t);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('%(tableName)s', %(existed)t);
  }

  private table(): Table {
    return new Table({
      name: '%(tableName)s',
      columns: this.tableColumns(),
    });
  }

  private tableColumns(): TableColumnOptions[] {
    return [
      // define table column in here
    ] as TableColumnOptions[];
  }
}
