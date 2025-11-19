import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePriceHistoryTable1763066871828 implements MigrationInterface {
    name = 'CreatePriceHistoryTable1763066871828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "historial_precio" ("historial_precio_id" SERIAL NOT NULL, "precio_nuevo" numeric(10,2) NOT NULL, "fecha_cambio" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "producto_id" integer NOT NULL, "usuario_modifico_id" integer NOT NULL, CONSTRAINT "PK_f387338e4f660bef0c7b79f03ae" PRIMARY KEY ("historial_precio_id"))`);
        await queryRunner.query(`ALTER TABLE "historial_precio" ADD CONSTRAINT "FK_e2f1eed194c44ae80d797cb6d1b" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_precio" ADD CONSTRAINT "FK_f1c171fb12317c7a4be685b29e2" FOREIGN KEY ("usuario_modifico_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "historial_precio" DROP CONSTRAINT "FK_f1c171fb12317c7a4be685b29e2"`);
        await queryRunner.query(`ALTER TABLE "historial_precio" DROP CONSTRAINT "FK_e2f1eed194c44ae80d797cb6d1b"`);
        await queryRunner.query(`DROP TABLE "historial_precio"`);
    }

}
