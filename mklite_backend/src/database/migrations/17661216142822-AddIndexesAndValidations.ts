// src/database/migrations/17661216142822-AddIndexesAndValidations.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesAndValidations17661216142822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Agregando índices y validaciones...");

        // =================================================================================
        // ÍNDICES PARA ORDERS
        // =================================================================================
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders"("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders"("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "orders"("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_user_status" ON "orders"("user_id", "status")`);
        console.log("✅ Índices de orders creados");

        // =================================================================================
        // ÍNDICES PARA PRODUCTS
        // =================================================================================
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "products"("category_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_products_is_active" ON "products"("is_active")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_products_name" ON "products"("name")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_products_category_active" ON "products"("category_id", "is_active")`);
        console.log("✅ Índices de products creados");

        // =================================================================================
        // ÍNDICES PARA ADDRESSES
        // =================================================================================
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_addresses_user_id" ON "addresses"("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_addresses_is_default" ON "addresses"("is_default")`);
        console.log("✅ Índices de addresses creados");

        // =================================================================================
        // ÍNDICES PARA SHIPMENTS
        // =================================================================================
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_shipments_driver_id" ON "shipments"("delivery_driver_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_shipments_status" ON "shipments"("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_shipments_address_id" ON "shipments"("delivery_address_id")`);
        console.log("✅ Índices de shipments creados");

        // =================================================================================
        // ÍNDICES PARA NOTIFICATIONS
        // =================================================================================
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_user_id" ON "notifications"("user_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_is_read" ON "notifications"("is_read")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_created_at" ON "notifications"("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_notifications_user_read" ON "notifications"("user_id", "is_read")`);
        console.log("✅ Índices de notifications creados");

        // =================================================================================
        // VALIDACIONES CHECK PARA PRODUCTS
        // =================================================================================
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_sale_price_positive'
                ) THEN
                    ALTER TABLE "products" ADD CONSTRAINT "chk_sale_price_positive" 
                    CHECK (sale_price > 0);
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_physical_stock_non_negative'
                ) THEN
                    ALTER TABLE "products" ADD CONSTRAINT "chk_physical_stock_non_negative" 
                    CHECK (physical_stock >= 0);
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_reserved_stock_non_negative'
                ) THEN
                    ALTER TABLE "products" ADD CONSTRAINT "chk_reserved_stock_non_negative" 
                    CHECK (reserved_stock >= 0);
                END IF;
            END $$;
        `);
        console.log("✅ Validaciones de products creadas");

        // =================================================================================
        // VALIDACIONES CHECK PARA ORDER_ITEMS
        // =================================================================================
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_quantity_positive'
                ) THEN
                    ALTER TABLE "order_items" ADD CONSTRAINT "chk_order_items_quantity_positive" 
                    CHECK (quantity > 0);
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_unit_price_positive'
                ) THEN
                    ALTER TABLE "order_items" ADD CONSTRAINT "chk_order_items_unit_price_positive" 
                    CHECK (unit_price > 0);
                END IF;
            END $$;
        `);
        console.log("✅ Validaciones de order_items creadas");

        // =================================================================================
        // VALIDACIONES CHECK PARA ORDERS
        // =================================================================================
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_total_positive'
                ) THEN
                    ALTER TABLE "orders" ADD CONSTRAINT "chk_order_total_positive" 
                    CHECK (order_total > 0);
                END IF;
            END $$;
        `);
        console.log("✅ Validaciones de orders creadas");

        // =================================================================================
        // VALIDACIONES CHECK PARA ADDRESSES (COORDENADAS)
        // =================================================================================
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_latitude_range'
                ) THEN
                    ALTER TABLE "addresses" ADD CONSTRAINT "chk_latitude_range" 
                    CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'chk_longitude_range'
                ) THEN
                    ALTER TABLE "addresses" ADD CONSTRAINT "chk_longitude_range" 
                    CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
                END IF;
            END $$;
        `);
        console.log("✅ Validaciones de addresses creadas");

        console.log("✅ Todos los índices y validaciones agregados");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("🔄 Revirtiendo índices y validaciones...");

        // Eliminar constraints
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT IF EXISTS "chk_longitude_range"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT IF EXISTS "chk_latitude_range"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "chk_order_total_positive"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "chk_order_items_unit_price_positive"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "chk_order_items_quantity_positive"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "chk_reserved_stock_non_negative"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "chk_physical_stock_non_negative"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "chk_sale_price_positive"`);

        // Eliminar índices
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_user_read"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_is_read"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipments_address_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipments_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipments_driver_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_addresses_is_default"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_addresses_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_category_active"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_name"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_is_active"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_category_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_user_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_created_at"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_user_id"`);

        console.log("✅ Reversión completada");
    }
}

