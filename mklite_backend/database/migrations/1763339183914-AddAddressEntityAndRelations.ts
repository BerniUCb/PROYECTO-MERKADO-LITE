import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressEntityAndRelations1763339183914 implements MigrationInterface {
    name = 'AddAddressEntityAndRelations1763339183914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "direccion" ("direccion_id" SERIAL NOT NULL, "calle" character varying NOT NULL, "numero_exterior" character varying NOT NULL, "numero_interior" character varying, "codigo_postal" character varying NOT NULL, "ciudad" character varying NOT NULL, "estado" character varying NOT NULL, "referencias" character varying, "alias_direccion" character varying NOT NULL DEFAULT 'Casa', "is_default" boolean NOT NULL DEFAULT false, "usuario_id" integer NOT NULL, CONSTRAINT "PK_acd94fee8aad10e9468572704ac" PRIMARY KEY ("direccion_id"))`);
        await queryRunner.query(`ALTER TABLE "envio" ADD "direccion_entrega_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD CONSTRAINT "FK_2c5855a442b025a6076018deba6" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envio" ADD CONSTRAINT "FK_be779fd3e4c8ef204ac51b0c925" FOREIGN KEY ("direccion_entrega_id") REFERENCES "direccion"("direccion_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "envio" DROP CONSTRAINT "FK_be779fd3e4c8ef204ac51b0c925"`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP CONSTRAINT "FK_2c5855a442b025a6076018deba6"`);
        await queryRunner.query(`ALTER TABLE "envio" DROP COLUMN "direccion_entrega_id"`);
        await queryRunner.query(`DROP TABLE "direccion"`);
    }

}
