import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorProductStockForReservation1763075396122 implements MigrationInterface {
    name = 'RefactorProductStockForReservation1763075396122'

    /**
     * El método `up` aplica los cambios a la base de datos.
     * Usamos RENAME COLUMN para no perder los datos de stock existentes.
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE "producto" RENAME COLUMN "stock_disponible" TO "stock_fisico"`);
        await queryRunner.query(`ALTER TABLE "producto" ADD "stock_reservado" integer NOT NULL DEFAULT 0`);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revierte la adición de la columna.
        await queryRunner.query(`ALTER TABLE "producto" DROP COLUMN "stock_reservado"`);
        
        // Revierte el renombrado de la columna, volviendo al estado original.
        await queryRunner.query(`ALTER TABLE "producto" RENAME COLUMN "stock_fisico" TO "stock_disponible"`);
    }

}