import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762791528097 implements MigrationInterface {
    name = 'InitialSchema1762791528097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("ci" SERIAL NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_098e105d84a153cfa5d8306df98" PRIMARY KEY ("ci"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
