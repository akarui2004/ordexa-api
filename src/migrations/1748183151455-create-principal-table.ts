import { MigrationInterface, QueryRunner, Table, TableColumnOptions, TableForeignKey } from "typeorm";

export class CreatePrincipalTable1748183151455 implements MigrationInterface {
  private readonly tableName = 'principals';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table(), true);

    await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
      columnNames: ['organizationId'],
      referencedTableName: 'organizations',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));
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

      { name: 'organizationId', type: 'uuid', isNullable: false },

      { name: 'ownerId', type: 'uuid', isNullable: false },
      { name: 'ownerType', type: 'varchar', isNullable: false },

      { name: 'status', type: 'varchar', isNullable: true, default: `'active'` },

      { name: 'deletedAt', type: 'timestamp', isNullable: true },
      { name: 'createdAt', type: 'timestamp', default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', default: 'now()' },
    ] as TableColumnOptions[];
  }
}
