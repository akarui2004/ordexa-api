import { MigrationInterface, QueryRunner, Table, TableColumnOptions } from "typeorm";

export class CreateAccountTable1747833887047 implements MigrationInterface {
  private readonly tableName = 'accounts';

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

      { name: 'firstName', type: 'varchar', isNullable: false },
      { name: 'lastName', type: 'varchar', isNullable: true },

      { name: 'email', type: 'varchar', isNullable: false },
      { name: 'emailVerifiedAt', type: 'timestamp', isNullable: true },

      { name: 'mobile', type: 'varchar', isNullable: false },
      { name: 'mobileVerifiedAt', type: 'timestamp', isNullable: true },

      { name: 'birthDate', type: 'timestamp', isNullable: true },

      { name: 'bio', type: 'text', isNullable: true },

      { name: 'deletedAt', type: 'timestamp', isNullable: true },
      { name: 'createdAt', type: 'timestamp', default: 'now()' },
      { name: 'updatedAt', type: 'timestamp', default: 'now()' },
    ] as TableColumnOptions[];
  }
}
