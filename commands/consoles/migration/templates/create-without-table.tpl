import { MigrationInterface, QueryRunner } from "typeorm";

export class %(className)s%(timestamp)s implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add up query here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // add down query here
  }
}
