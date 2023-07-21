import { MigrationInterface, QueryRunner } from "typeorm";

export class CoffeeRefactor1689947889549 implements MigrationInterface {
    name = 'CoffeeRefactor1689947889549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

}
