// src/database/migrations/17661216141659-SplitCoordinatesIntoLatLng.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class SplitCoordinatesIntoLatLng17661216141659 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Separando coordinates en latitude y longitude...");

        // 1. Verificar y agregar las nuevas columnas latitude y longitude (idempotente)
        const hasLatitude = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'addresses' AND column_name = 'latitude'
        `);
        
        const hasLongitude = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'addresses' AND column_name = 'longitude'
        `);

        if (hasLatitude.length === 0) {
            await queryRunner.query(`ALTER TABLE "addresses" ADD COLUMN "latitude" DECIMAL(10, 7)`);
            console.log("✅ Columna latitude creada");
        } else {
            console.log("ℹ️ Columna latitude ya existe, omitiendo creación");
        }

        if (hasLongitude.length === 0) {
            await queryRunner.query(`ALTER TABLE "addresses" ADD COLUMN "longitude" DECIMAL(10, 7)`);
            console.log("✅ Columna longitude creada");
        } else {
            console.log("ℹ️ Columna longitude ya existe, omitiendo creación");
        }

        // 2. Verificar si existe la columna coordinates antes de migrar datos
        const hasCoordinates = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'addresses' AND column_name = 'coordinates'
        `);

        if (hasCoordinates.length > 0) {
            // Migrar datos existentes del formato "lat,lng" a las nuevas columnas
            // Solo si el campo coordinates tiene el formato correcto y las nuevas columnas están vacías
            await queryRunner.query(`
                UPDATE "addresses"
                SET 
                    "latitude" = CAST(SPLIT_PART("coordinates", ',', 1) AS DECIMAL(10, 7)),
                    "longitude" = CAST(SPLIT_PART("coordinates", ',', 2) AS DECIMAL(10, 7))
                WHERE "coordinates" IS NOT NULL 
                AND "coordinates" != ''
                AND "coordinates" ~ '^-?[0-9]+\.?[0-9]*,-?[0-9]+\.?[0-9]*$'
                AND ("latitude" IS NULL OR "longitude" IS NULL)
            `);
            console.log("✅ Datos migrados desde coordinates");

            // 3. Eliminar la columna antigua coordinates
            await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "coordinates"`);
            console.log("✅ Columna coordinates eliminada");
        } else {
            console.log("ℹ️ Columna coordinates no existe, omitiendo migración y eliminación");
        }

        console.log("✅ Migración completada");
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

