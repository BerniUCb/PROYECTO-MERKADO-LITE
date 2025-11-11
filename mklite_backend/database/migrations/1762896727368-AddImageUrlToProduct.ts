import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToProduct1762896727368 implements MigrationInterface {
    name = 'AddImageUrlToProduct1762896727368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" ADD "url_imagen" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "producto" ALTER COLUMN "unidad_medida" SET DEFAULT 'Unidad'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producto" ALTER COLUMN "unidad_medida" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "url_imagen"`);
    }

}
