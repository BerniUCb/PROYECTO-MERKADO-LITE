import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialEnglishSchema1763503080389 implements MigrationInterface {
    name = 'CreateInitialEnglishSchema1763503080389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("category_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_51615bef2cea22812d0dcab6e18" PRIMARY KEY ("category_id"))`);
        await queryRunner.query(`CREATE TABLE "price_history" ("price_history_id" SERIAL NOT NULL, "new_price" numeric(10,2) NOT NULL, "changed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" integer NOT NULL, "changed_by_user_id" integer NOT NULL, CONSTRAINT "PK_8384c6b4f8ca2abb0c18a77e2a6" PRIMARY KEY ("price_history_id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("product_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "sale_price" numeric NOT NULL, "unit_of_measure" character varying NOT NULL DEFAULT 'Unit', "physical_stock" integer NOT NULL, "reserved_stock" integer NOT NULL DEFAULT '0', "image_url" character varying(512), "is_active" boolean NOT NULL DEFAULT true, "category_id" integer, CONSTRAINT "PK_a8940a4bf3b90bd7ac15c8f4dd9" PRIMARY KEY ("product_id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("order_item_id" SERIAL NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_54c952fdc94b9b487ef968b4047" PRIMARY KEY ("order_item_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("order_id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "order_total" numeric NOT NULL, "payment_method" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_cad55b3cb25b38be94d2ce831db" PRIMARY KEY ("order_id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("address_id" SERIAL NOT NULL, "street" character varying NOT NULL, "street_number" character varying NOT NULL, "internal_number" character varying, "postal_code" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "references" character varying, "address_alias" character varying NOT NULL DEFAULT 'Home', "is_default" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, CONSTRAINT "PK_7075006c2d82acfeb0ea8c5dce7" PRIMARY KEY ("address_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shipments_status_enum" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "shipments" ("shipment_id" SERIAL NOT NULL, "status" "public"."shipments_status_enum" NOT NULL DEFAULT 'pending', "assigned_at" TIMESTAMP WITH TIME ZONE, "estimated_delivery_at" TIMESTAMP WITH TIME ZONE, "delivered_at" TIMESTAMP WITH TIME ZONE, "order_id" integer NOT NULL, "delivery_driver_id" integer, "delivery_address_id" integer NOT NULL, CONSTRAINT "REL_e86fac2a18a75dcb82bfbb23f4" UNIQUE ("order_id"), CONSTRAINT "PK_989740f5c96be92fd5d29c5349d" PRIMARY KEY ("shipment_id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("cart_item_id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unit_price" numeric NOT NULL, "added_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "UQ_b2c6ebe6bd6f9a4e6bbd8ab082e" UNIQUE ("user_id", "product_id"), CONSTRAINT "PK_136052dba9e33c62b93c6a291f8" PRIMARY KEY ("cart_item_id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("rating_id" SERIAL NOT NULL, "score" integer NOT NULL, "comment" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "order_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "REL_678aeb7d6df2fdcba5052b32ec" UNIQUE ("order_id"), CONSTRAINT "CHK_ad762b3e19f45d2f3a82f30afc" CHECK ("score" >= 1 AND "score" <= 5), CONSTRAINT "PK_dc4f636dd0dd5a75e84115a606f" PRIMARY KEY ("rating_id"))`);
        await queryRunner.query(`CREATE TABLE "suppliers" ("supplier_id" SERIAL NOT NULL, "company_name" character varying NOT NULL, "contact_name" character varying, "email" character varying, "phone" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a2692f796d16e0a30040860112a" PRIMARY KEY ("supplier_id"))`);
        await queryRunner.query(`CREATE TABLE "lots" ("lot_id" SERIAL NOT NULL, "received_quantity" integer NOT NULL, "current_quantity" integer NOT NULL, "supplier_cost" numeric(10,2), "received_at" date NOT NULL, "expires_at" date, "product_id" integer NOT NULL, "supplier_id" integer, CONSTRAINT "PK_a45e2701b70fe721cad8cc8a1a8" PRIMARY KEY ("lot_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_movements_type_enum" AS ENUM('purchase_entry', 'sale_exit', 'expired_adjustment', 'return_adjustment')`);
        await queryRunner.query(`CREATE TABLE "stock_movements" ("movement_id" SERIAL NOT NULL, "quantity" integer NOT NULL, "type" "public"."stock_movements_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" integer NOT NULL, "lot_id" integer, "user_id" integer, CONSTRAINT "PK_0f70b9ee3f986deef0e0d450c26" PRIMARY KEY ("movement_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('CASH_REGISTER_CLOSED', 'LOW_STOCK', 'HIGH_DEMAND_PRODUCT', 'ORDER_RECEIVED', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'NEW_PROMOTION')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_recipient_role_enum" AS ENUM('Admin', 'Client')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("notification_id" SERIAL NOT NULL, "title" character varying NOT NULL, "detail" text NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "recipient_role" "public"."notifications_recipient_role_enum" NOT NULL, "related_entity_id" character varying, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_eaedfe19f0f765d26afafa85956" PRIMARY KEY ("notification_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Admin', 'Seller', 'Warehouse', 'DeliveryDriver', 'Client', 'Support', 'Supplier')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "support_messages" ("support_message_id" SERIAL NOT NULL, "content" text NOT NULL, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "support_ticket_id" integer NOT NULL, "sender_id" integer NOT NULL, CONSTRAINT "PK_22035a855b83a4634ffb88db942" PRIMARY KEY ("support_message_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."support_tickets_status_enum" AS ENUM('open', 'in_progress', 'resolved', 'closed')`);
        await queryRunner.query(`CREATE TABLE "support_tickets" ("support_ticket_id" SERIAL NOT NULL, "subject" character varying NOT NULL, "status" "public"."support_tickets_status_enum" NOT NULL DEFAULT 'open', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" integer NOT NULL, "user_id" integer NOT NULL, "agent_id" integer, CONSTRAINT "PK_f5a0f00f948169bd187f4725bba" PRIMARY KEY ("support_ticket_id"))`);
        await queryRunner.query(`CREATE TABLE "promotions" ("promotion_id" SERIAL NOT NULL, "description" character varying NOT NULL, "discount_type" character varying, "discount_value" numeric(10,2), "starts_at" TIMESTAMP WITH TIME ZONE, "ends_at" TIMESTAMP WITH TIME ZONE, "product_id" integer, CONSTRAINT "PK_e151ef85c700deef77ec80ff13a" PRIMARY KEY ("promotion_id"))`);
        await queryRunner.query(`ALTER TABLE "price_history" ADD CONSTRAINT "FK_ebdb4d54c8de7847c0f7a9e4fbb" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_history" ADD CONSTRAINT "FK_478d395fcf414721010cb385ce3" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD CONSTRAINT "FK_e86fac2a18a75dcb82bfbb23f43" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD CONSTRAINT "FK_500258ad15bde0079ce26856733" FOREIGN KEY ("delivery_driver_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD CONSTRAINT "FK_8cda80b5b9d97621efdddd0bae7" FOREIGN KEY ("delivery_address_id") REFERENCES "addresses"("address_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_678aeb7d6df2fdcba5052b32ecb" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_612547dfb7be1485b6a7423da2a" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lots" ADD CONSTRAINT "FK_0d6e68f12ccd3acf31b56885dff" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_2c1bb05b80ddcc562cd28d826c6" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_ae0e902cfdcb5b3ab258a9ff473" FOREIGN KEY ("lot_id") REFERENCES "lots"("lot_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_movements" ADD CONSTRAINT "FK_d7fedfd6ee0f4a06648c48631c6" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_messages" ADD CONSTRAINT "FK_17053558094538adcbfa2eb8855" FOREIGN KEY ("support_ticket_id") REFERENCES "support_tickets"("support_ticket_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_messages" ADD CONSTRAINT "FK_db9f9d46849e30b9ac570db6eb6" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_4c3a306f404bff5817f37d46616" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_0b1eb4f1f984aab3c481c48468a" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_8c5e35b7820ad511f1f5425cc24" FOREIGN KEY ("agent_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promotions" ADD CONSTRAINT "FK_b3b55da5e8dbf3241ba1059b679" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotions" DROP CONSTRAINT "FK_b3b55da5e8dbf3241ba1059b679"`);
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_8c5e35b7820ad511f1f5425cc24"`);
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_0b1eb4f1f984aab3c481c48468a"`);
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_4c3a306f404bff5817f37d46616"`);
        await queryRunner.query(`ALTER TABLE "support_messages" DROP CONSTRAINT "FK_db9f9d46849e30b9ac570db6eb6"`);
        await queryRunner.query(`ALTER TABLE "support_messages" DROP CONSTRAINT "FK_17053558094538adcbfa2eb8855"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_d7fedfd6ee0f4a06648c48631c6"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_ae0e902cfdcb5b3ab258a9ff473"`);
        await queryRunner.query(`ALTER TABLE "stock_movements" DROP CONSTRAINT "FK_2c1bb05b80ddcc562cd28d826c6"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_0d6e68f12ccd3acf31b56885dff"`);
        await queryRunner.query(`ALTER TABLE "lots" DROP CONSTRAINT "FK_612547dfb7be1485b6a7423da2a"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_f49ef8d0914a14decddbb170f2f"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_678aeb7d6df2fdcba5052b32ecb"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP CONSTRAINT "FK_8cda80b5b9d97621efdddd0bae7"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP CONSTRAINT "FK_500258ad15bde0079ce26856733"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP CONSTRAINT "FK_e86fac2a18a75dcb82bfbb23f43"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "price_history" DROP CONSTRAINT "FK_478d395fcf414721010cb385ce3"`);
        await queryRunner.query(`ALTER TABLE "price_history" DROP CONSTRAINT "FK_ebdb4d54c8de7847c0f7a9e4fbb"`);
        await queryRunner.query(`DROP TABLE "promotions"`);
        await queryRunner.query(`DROP TABLE "support_tickets"`);
        await queryRunner.query(`DROP TYPE "public"."support_tickets_status_enum"`);
        await queryRunner.query(`DROP TABLE "support_messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_recipient_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "stock_movements"`);
        await queryRunner.query(`DROP TYPE "public"."stock_movements_type_enum"`);
        await queryRunner.query(`DROP TABLE "lots"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "shipments"`);
        await queryRunner.query(`DROP TYPE "public"."shipments_status_enum"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "price_history"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
