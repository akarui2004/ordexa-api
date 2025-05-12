import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccountTable1747061665348 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'accounts',
            columns: [
                { name: 'id', type: 'uuid', isPrimary: true, isGenerated: true, generationStrategy: 'uuid' },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'status', type: 'enum', enum: ['active', 'inactive'], default: `'active'` },
                { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                { name: 'deletedAt', type: 'timestamp', default: null, isNullable: true },
            ]
        });
        await queryRunner.createTable(table, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('accounts', true);
    }

}
