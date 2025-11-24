import { MigrationInterface, QueryRunner } from "typeorm";
export class AddTimestampsToProducts1764000739175 implements MigrationInterface {
name = 'AddTimestampsToProducts1764000739175'
code
Code
public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "created_at"`);
}
}