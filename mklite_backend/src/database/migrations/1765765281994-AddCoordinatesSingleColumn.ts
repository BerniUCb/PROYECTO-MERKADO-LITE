import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoordinatesSingleColumn1765765281994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Crear la columna única
        await queryRunner.query(`ALTER TABLE "addresses" ADD "coordinates" character varying(50)`);
        
        // (Opcional) Si habías creado las otras, bórralas para no tener basura
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "latitude"`);
        // await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "longitude"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "coordinates"`);
    }
}