// src/database/migrations/17661216141659-SplitCoordinatesIntoLatLng.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitCoordinatesIntoLatLng17661216141659 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Separando coordinates en latitude y longitude...");

        // 1. Agregar las nuevas columnas latitude y longitude
        await queryRunner.query(`
            ALTER TABLE "addresses" 
            ADD COLUMN "latitude" DECIMAL(10, 7),
            ADD COLUMN "longitude" DECIMAL(10, 7)
        `);

        // 2. Migrar datos existentes del formato "lat,lng" a las nuevas columnas
        // Solo si el campo coordinates tiene el formato correcto
        await queryRunner.query(`
            UPDATE "addresses"
            SET 
                "latitude" = CAST(SPLIT_PART("coordinates", ',', 1) AS DECIMAL(10, 7)),
                "longitude" = CAST(SPLIT_PART("coordinates", ',', 2) AS DECIMAL(10, 7))
            WHERE "coordinates" IS NOT NULL 
            AND "coordinates" != ''
            AND "coordinates" ~ '^-?[0-9]+\.?[0-9]*,-?[0-9]+\.?[0-9]*$'
        `);

        // 3. Para direcciones de delivery (Shipment.deliveryAddress), asegurar que no sean null
        // Esto se hará en una validación a nivel de aplicación, pero podemos marcar las que ya existen
        console.log("✅ Columnas latitude y longitude creadas y datos migrados");

        // 4. Eliminar la columna antigua coordinates
        await queryRunner.query(`
            ALTER TABLE "addresses" DROP COLUMN "coordinates"
        `);

        console.log("✅ Columna coordinates eliminada");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Revirtiendo: uniendo latitude y longitude en coordinates...");

        // 1. Recrear la columna coordinates
        await queryRunner.query(`
            ALTER TABLE "addresses" 
            ADD COLUMN "coordinates" character varying(50)
        `);

        // 2. Migrar datos de latitude y longitude de vuelta a coordinates
        await queryRunner.query(`
            UPDATE "addresses"
            SET "coordinates" = CONCAT("latitude", ',', "longitude")
            WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL
        `);

        // 3. Eliminar las columnas latitude y longitude
        await queryRunner.query(`
            ALTER TABLE "addresses" 
            DROP COLUMN "latitude",
            DROP COLUMN "longitude"
        `);

        console.log("✅ Reversión completada");
    }
}

