import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDetallePedidoEntity1762975553729 implements MigrationInterface {
    name = 'AddDetallePedidoEntity1762975553729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "detalle_pedido" ("detalle_pedido_id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric NOT NULL, "pedido_id" integer NOT NULL, "producto_id" integer NOT NULL, CONSTRAINT "PK_94e062e47428c7a012032e96cbc" PRIMARY KEY ("detalle_pedido_id"))`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_17fc57ebe34e3bcf93c7ff79673" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("pedido_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" ADD CONSTRAINT "FK_c5bc9bfea7770ba12a9431904f3" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_c5bc9bfea7770ba12a9431904f3"`);
        await queryRunner.query(`ALTER TABLE "detalle_pedido" DROP CONSTRAINT "FK_17fc57ebe34e3bcf93c7ff79673"`);
        await queryRunner.query(`DROP TABLE "detalle_pedido"`);
    }

}
