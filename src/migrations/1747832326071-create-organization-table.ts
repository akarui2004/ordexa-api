import { MigrationInterface, QueryRunner, Table, TableColumnOptions } from "typeorm";

export class CreateOrganizationTable1747832326071 implements MigrationInterface {
  private readonly tableName = 'organizations';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table(), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true);
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
      { name: 'name', type: 'varchar', isNullable: false },
      { name: 'status', type: 'varchar', default: `'active'`, isNullable: true },
      { name: 'deletedAt', type: 'timestamp', isNullable: true },
      { name: 'createdAt', type: 'timestamp', default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', default: 'now()' },
    ] as TableColumnOptions[];
  }
}
