// src/database/migrations/TIMESTAMP-AddDriverToNotificationEnum.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDriverToNotificationEnum1765845168957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Solo agregar el valor si no existe para evitar error 42710 en entornos ya actualizados
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_enum e
                    JOIN pg_type t ON e.enumtypid = t.oid
                    WHERE t.typname = 'notifications_recipient_role_enum'
                      AND e.enumlabel = 'DeliveryDriver'
                ) THEN
                    ALTER TYPE "public"."notifications_recipient_role_enum" ADD VALUE 'DeliveryDriver';
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }
}