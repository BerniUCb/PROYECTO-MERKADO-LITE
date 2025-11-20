import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteDatabaseSchema1763590523402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. AGREGAR 2FA A USUARIOS (HU21)
        await queryRunner.query(`ALTER TABLE "users" ADD "is_two_factor_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "two_factor_secret" character varying`);

        // 2. CREAR TABLA PAGOS (HU6 - Comprobantes)
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('cash', 'qr', 'card')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded')`);
        
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "payment_id" SERIAL NOT NULL, 
                "amount" numeric(10,2) NOT NULL, 
                "payment_method" "public"."payments_method_enum" NOT NULL DEFAULT 'cash', 
                "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', 
                "receipt_number" character varying, 
                "receipt_url" character varying, 
                "paid_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "order_id" integer NOT NULL, 
                CONSTRAINT "UQ_receipt_number" UNIQUE ("receipt_number"), 
                CONSTRAINT "REL_order_payment" UNIQUE ("order_id"), 
                CONSTRAINT "PK_payment_id" PRIMARY KEY ("payment_id")
            )
        `);
        // Relacionar Pago con Orden
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_order" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // 3. CREAR TABLA DEVOLUCIONES PROVEEDOR (HU10)
        await queryRunner.query(`CREATE TYPE "public"."supplier_returns_reason_enum" AS ENUM('expired', 'defective', 'damaged_shipping')`);
        await queryRunner.query(`CREATE TYPE "public"."supplier_returns_status_enum" AS ENUM('pending', 'approved', 'rejected', 'refunded')`);

        await queryRunner.query(`
            CREATE TABLE "supplier_returns" (
                "return_id" SERIAL NOT NULL, 
                "quantity" integer NOT NULL, 
                "reason" "public"."supplier_returns_reason_enum" NOT NULL, 
                "status" "public"."supplier_returns_status_enum" NOT NULL DEFAULT 'pending', 
                "notes" text, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "resolved_at" TIMESTAMP, 
                "product_id" integer NOT NULL, 
                "supplier_id" integer NOT NULL, 
                "lot_id" integer, 
                CONSTRAINT "PK_return_id" PRIMARY KEY ("return_id")
            )
        `);
        // Relaciones de Devoluciones
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_product" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_lot" FOREIGN KEY ("lot_id") REFERENCES "lots"("lot_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // El camino de reversa (por si acaso)
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_lot"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_supplier"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_product"`);
        await queryRunner.query(`DROP TABLE "supplier_returns"`);
        await queryRunner.query(`DROP TYPE "public"."supplier_returns_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."supplier_returns_reason_enum"`);

        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payment_order"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "two_factor_secret"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_two_factor_enabled"`);
    }
}