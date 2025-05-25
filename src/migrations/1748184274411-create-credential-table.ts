import { MigrationInterface, QueryRunner, Table, TableColumnOptions, TableForeignKey } from "typeorm";

export class CreateCredentialTable1748184274411 implements MigrationInterface {
  private readonly tableName = 'credentials';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table(), true);

    await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
      columnNames: ['principalId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'principals',
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

      { name: 'principalId', type: 'uuid', isNullable: false },

      { name: 'accessKey', type: 'varchar', isNullable: false, length: '64' },
      { name: 'secretKey', type: 'varchar', isNullable: false },
      { name: 'type', type: 'varchar', isNullable: false, default: `'password'` },
      { name: 'verifiedAt', type: 'timestamp', isNullable: true },

      { name: 'deletedAt', type: 'timestamp', isNullable: true },
      { name: 'createdAt', type: 'timestamp', default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', default: 'now()' },
    ] as TableColumnOptions[];
  }
}
