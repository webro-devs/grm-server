import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEUSER1688643530356 implements MigrationInterface {
    name = 'CREATEUSER1688643530356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "color" ADD "text" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "color" DROP COLUMN "text"`);
    }

}
