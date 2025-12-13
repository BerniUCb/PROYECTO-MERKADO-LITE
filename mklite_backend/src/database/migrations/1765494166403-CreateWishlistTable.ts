import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWishlistTable1765494166403 implements MigrationInterface {
    name = 'CreateWishlistTable1765494166403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // SOLO ESTO DEBE QUEDAR: La creación de la tabla wishlist
        await queryRunner.query(`
            CREATE TABLE "wishlist_items" (
                "wishlist_item_id" SERIAL NOT NULL, 
                "added_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "user_id" integer NOT NULL, 
                "product_id" integer NOT NULL, 
                CONSTRAINT "UQ_wishlist_user_product" UNIQUE ("user_id", "product_id"), 
                CONSTRAINT "PK_wishlist_item_id" PRIMARY KEY ("wishlist_item_id")
            )
        `);

        // Y sus relaciones (Foreign Keys)
        await queryRunner.query(`
            ALTER TABLE "wishlist_items" 
            ADD CONSTRAINT "FK_wishlist_user" 
            FOREIGN KEY ("user_id") REFERENCES "users"("user_id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "wishlist_items" 
            ADD CONSTRAINT "FK_wishlist_product" 
            FOREIGN KEY ("product_id") REFERENCES "products"("product_id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // El reverso solo borra la wishlist
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_wishlist_product"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_wishlist_user"`);
        await queryRunner.query(`DROP TABLE "wishlist_items"`);
    }
}