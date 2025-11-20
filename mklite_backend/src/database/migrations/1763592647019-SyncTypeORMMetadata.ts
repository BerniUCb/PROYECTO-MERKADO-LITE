import { MigrationInterface, QueryRunner } from "typeorm";

export class PruebaDeSincronizacion1763592647019 implements MigrationInterface {
    name = 'PruebaDeSincronizacion1763592647019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_product"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_supplier"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_return_lot"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payment_order"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_method_enum" RENAME TO "payments_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('cash', 'qr', 'card')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING "payment_method"::"text"::"public"."payments_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" SET DEFAULT 'cash'`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum_old"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_bc5bd3e261a01539766d9f941b6" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_e259919f3bf18a5c54dcac65fd0" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_73619a802b5436e386f84f69932" FOREIGN KEY ("lot_id") REFERENCES "lots"("lot_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_73619a802b5436e386f84f69932"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_e259919f3bf18a5c54dcac65fd0"`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" DROP CONSTRAINT "FK_bc5bd3e261a01539766d9f941b6"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum_old" AS ENUM('cash', 'qr', 'card')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_method_enum_old" USING "payment_method"::"text"::"public"."payments_method_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" SET DEFAULT 'cash'`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_method_enum_old" RENAME TO "payments_method_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_order" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_lot" FOREIGN KEY ("lot_id") REFERENCES "lots"("lot_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_supplier" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_returns" ADD CONSTRAINT "FK_return_product" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
