import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1742222850527 implements MigrationInterface {
    name = 'CreateUserTable1742222850527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the user table with the necessary columns
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR NOT NULL,
                "password" VARCHAR NOT NULL
            );
        `);

        // Apply additional constraints
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes in case of rollback
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}

