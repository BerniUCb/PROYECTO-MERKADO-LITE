import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "../../entity/product.entity";
export class UpdateProductImageUrls1764001454590 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Obtenemos todos los productos actuales de la base de datos
        const products = await queryRunner.manager.find(Product);

        if (products.length === 0) {
            console.log('Skipping image URL update: No products found.');
            return;
        }

        // Usaremos el servicio picsum.photos para generar imágenes de placeholder consistentes
        // y con un tamaño cuadrado (400x400) para que el diseño no se distorsione.
        const baseUrl = 'https://picsum.photos/seed/';

        for (const product of products) {
            // Usamos el ID del producto como "seed" (semilla) para que cada producto
            // tenga una imagen única pero que sea siempre la misma.
            product.imageUrl = `${baseUrl}${product.id}/400`;
        }
        
        // Guardamos todos los productos actualizados en una sola operación
        await queryRunner.manager.save(products);

        console.log(` Updated image URLs for ${products.length} products.`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // El método down es nuestro "deshacer". 
        await queryRunner.query(`UPDATE "products" SET "image_url" = NULL`);
        console.log(' Reverted product image URLs to NULL.');
    }
}