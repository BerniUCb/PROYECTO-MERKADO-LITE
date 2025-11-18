import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrecioUnitarioToCarritoItem1762975838152 implements MigrationInterface {
    name = 'AddPrecioUnitarioToCarritoItem1762975838152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carrito_item" ADD "precio_unitario" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carrito_item" DROP COLUMN "precio_unitario"`);
    }

}
