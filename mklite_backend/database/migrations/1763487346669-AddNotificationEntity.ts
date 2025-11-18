import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationEntity1763487346669 implements MigrationInterface {
    name = 'AddNotificationEntity1763487346669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notificacion_tipo_enum" AS ENUM('CIERRE_CAJA', 'STOCK_BAJO', 'DEMANDA_ALTA_PRODUCTO', 'PEDIDO_RECIBIDO', 'PEDIDO_EN_CAMINO', 'PEDIDO_ENTREGADO', 'NUEVA_PROMOCION')`);
        await queryRunner.query(`CREATE TYPE "public"."notificacion_destinatario_rol_enum" AS ENUM('Administrador', 'Cliente')`);
        await queryRunner.query(`CREATE TABLE "notificacion" ("notificacion_id" SERIAL NOT NULL, "titulo" character varying NOT NULL, "detalle" text NOT NULL, "tipo" "public"."notificacion_tipo_enum" NOT NULL, "destinatario_rol" "public"."notificacion_destinatario_rol_enum" NOT NULL, "entidad_relacionada_id" character varying, "leido" boolean NOT NULL DEFAULT false, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "usuario_id" integer, CONSTRAINT "PK_72287e679b5e7a73714bde29762" PRIMARY KEY ("notificacion_id"))`);
        await queryRunner.query(`ALTER TABLE "notificacion" ADD CONSTRAINT "FK_6c7a40c0a97e2d62f07156c2943" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notificacion" DROP CONSTRAINT "FK_6c7a40c0a97e2d62f07156c2943"`);
        await queryRunner.query(`DROP TABLE "notificacion"`);
        await queryRunner.query(`DROP TYPE "public"."notificacion_destinatario_rol_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notificacion_tipo_enum"`);
    }

}
