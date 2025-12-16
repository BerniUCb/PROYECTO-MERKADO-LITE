// src/database/migrations/TIMESTAMP-AddDriverToNotificationEnum.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDriverToNotificationEnum1765845168957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TYPE "public"."notifications_recipient_role_enum" ADD VALUE 'DeliveryDriver'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }
}