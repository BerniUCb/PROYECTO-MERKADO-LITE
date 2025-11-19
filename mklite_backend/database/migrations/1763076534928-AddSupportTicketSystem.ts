import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupportTicketSystem1763076534928 implements MigrationInterface {
    name = 'AddSupportTicketSystem1763076534928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mensaje_soporte" ("mensaje_soporte_id" SERIAL NOT NULL, "contenido" text NOT NULL, "fecha_envio" TIMESTAMP NOT NULL DEFAULT now(), "ticket_soporte_id" integer NOT NULL, "remitente_id" integer NOT NULL, CONSTRAINT "PK_8e33366fb6420ef32e6162b5c11" PRIMARY KEY ("mensaje_soporte_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_soporte_estado_enum" AS ENUM('abierto', 'en_proceso', 'resuelto', 'cerrado')`);
        await queryRunner.query(`CREATE TABLE "ticket_soporte" ("ticket_soporte_id" SERIAL NOT NULL, "asunto" character varying NOT NULL, "estado" "public"."ticket_soporte_estado_enum" NOT NULL DEFAULT 'abierto', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), "pedido_id" integer NOT NULL, "cliente_id" integer NOT NULL, "agente_id" integer, CONSTRAINT "PK_7013a0faeb1ec2c484451443923" PRIMARY KEY ("ticket_soporte_id"))`);
        await queryRunner.query(`ALTER TABLE "mensaje_soporte" ADD CONSTRAINT "FK_cd2d1039522763d96e48e6fbc00" FOREIGN KEY ("ticket_soporte_id") REFERENCES "ticket_soporte"("ticket_soporte_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mensaje_soporte" ADD CONSTRAINT "FK_3fcd2b8897e958f859d290abfa6" FOREIGN KEY ("remitente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_soporte" ADD CONSTRAINT "FK_facd2314d585877a9f543514e22" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("pedido_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_soporte" ADD CONSTRAINT "FK_d00e63f7132da14ea67668e5151" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_soporte" ADD CONSTRAINT "FK_248fb92d7440bb69d497383d599" FOREIGN KEY ("agente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket_soporte" DROP CONSTRAINT "FK_248fb92d7440bb69d497383d599"`);
        await queryRunner.query(`ALTER TABLE "ticket_soporte" DROP CONSTRAINT "FK_d00e63f7132da14ea67668e5151"`);
        await queryRunner.query(`ALTER TABLE "ticket_soporte" DROP CONSTRAINT "FK_facd2314d585877a9f543514e22"`);
        await queryRunner.query(`ALTER TABLE "mensaje_soporte" DROP CONSTRAINT "FK_3fcd2b8897e958f859d290abfa6"`);
        await queryRunner.query(`ALTER TABLE "mensaje_soporte" DROP CONSTRAINT "FK_cd2d1039522763d96e48e6fbc00"`);
        await queryRunner.query(`DROP TABLE "ticket_soporte"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_soporte_estado_enum"`);
        await queryRunner.query(`DROP TABLE "mensaje_soporte"`);
    }

}
