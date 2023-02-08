import { MigrationInterface, QueryRunner } from "typeorm";

export class entitiesChanges1672905384283 implements MigrationInterface {
    name = 'entitiesChanges1672905384283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userChats" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userChats" DROP COLUMN "name"`);
    }

}
