import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategory1740402373605 implements MigrationInterface {
    name = 'AddCategory1740402373605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "description"`);
    }

}
