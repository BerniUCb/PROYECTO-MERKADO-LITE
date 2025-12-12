// src/database/migrations/TIMESTAMP-CreateDriverApplicationsTable.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDriverApplicationsTable1765562379391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Crear los ENUMS (Tipos de datos personalizados en Postgres)
        await queryRunner.query(`
            CREATE TYPE "public"."driver_application_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
            CREATE TYPE "public"."driver_vehicle_type_enum" AS ENUM('moto', 'auto', 'bicicleta');
        `);

        // 2. Crear la Tabla
        await queryRunner.query(`
            CREATE TABLE "driver_applications" (
                "application_id" SERIAL NOT NULL,
                "identity_card" character varying(20) NOT NULL,
                "vehicle_type" "public"."driver_vehicle_type_enum" NOT NULL,
                "status" "public"."driver_application_status_enum" NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_driver_application" PRIMARY KEY ("application_id")
            )
        `);

        // 3. Crear la Foreign Key (Relación con Users)
        // ON DELETE CASCADE: Si se borra el usuario, se borra su solicitud (limpieza automática)
        await queryRunner.query(`
            ALTER TABLE "driver_applications" 
            ADD CONSTRAINT "FK_driver_application_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("user_id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir en orden inverso
        await queryRunner.query(`ALTER TABLE "driver_applications" DROP CONSTRAINT "FK_driver_application_user"`);
        await queryRunner.query(`DROP TABLE "driver_applications"`);
        await queryRunner.query(`DROP TYPE "public"."driver_vehicle_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."driver_application_status_enum"`);
    }
}