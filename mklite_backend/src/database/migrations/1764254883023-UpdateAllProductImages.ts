// src/database/migrations/TIMESTAMP-UpdateAllProductImages.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAllProductImages1764254883023 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🖼️ Iniciando carga manual de imágenes para todos los productos...");

        // =================================================================================
        // ZONA DE EDICIÓN: PEGA TUS LINKS AQUÍ
        // =================================================================================
        const imageMap: { [key: string]: string } = {
            
            // === CATEGORÍA 1: LÁCTEOS ===
            'Leche Pil Entera 1L': 'https://pilandina.com.bo/wp-content/uploads/2019/06/leche-entera-cremosa-Sachet-1100-ml-300x300.jpg',
            'Leche Pil Light 1L': 'https://pilandina.com.bo/wp-content/uploads/2019/06/Leche-Light-sachet-800-ml-300x300.jpg',
            'Leche Pil Deslactosada': 'https://pilandina.com.bo/wp-content/uploads/2019/06/Leche-Deslactosada-1-300x300.webp',
            'Leche Chocolatada Pil': 'https://pilandina.com.bo/wp-content/uploads/2019/06/Leche-Chocolate-1-300x300.webp',
            'Yogurt Bebible Frutilla': 'https://pilandina.com.bo/wp-content/uploads/2019/07/500x500-frutilla-200gr-300x300.jpg',
            'Yogurt Bebible Durazno': 'https://pilandina.com.bo/wp-content/uploads/2020/09/bonleyogurtdurazno-300x300.jpg',
            'Yogurt Griego Natural': 'https://pilandina.com.bo/wp-content/uploads/2023/07/YOGURT-GRECO-NATURAL-TRIPLE-CERO-BOLSA-1KG-300x300.webp',
            'Mantequilla Regia c/Sal': 'https://pilandina.com.bo/wp-content/uploads/2019/06/mantequillasal2-300x300.jpg',
            'Mantequilla Regia s/Sal': 'https://pilandina.com.bo/wp-content/uploads/2019/06/500x500-sinsal200-300x300.jpg',
            'Queso Menonita': 'https://amarket.com.bo/cdn/shop/files/9000439_150x150_crop_center.jpg?v=1712346132',
            'Queso Edam Pil': 'https://amarket.com.bo/cdn/shop/files/7772905001262_150x150_crop_center.jpg?v=1712343849',
            'Queso Mozzarella': 'https://amarket.com.bo/cdn/shop/files/9000445_150x150_crop_center.jpg?v=1712346131',
            'Queso Crema Pil': 'https://pilandina.com.bo/wp-content/uploads/2022/10/producto-nuevo-crema-bonle-300x300.png',
            'Leche Condensada Nestlé': '',
            'Leche Evaporada Gloria': 'https://amarket.com.bo/cdn/shop/files/8716200458719_150x150_crop_center.jpg?v=1712343945',
            'Crema de Leche Pil': 'https://amarket.com.bo/cdn/shop/files/7501001600426_443x443.jpg?v=1712344298',
            'Dulce de Leche Pil': 'https://amarket.com.bo/cdn/shop/files/7772905000029_443x443.jpg?v=1712344706',
            'Helado Cabrera 2L': 'https://amarket.com.bo/cdn/shop/files/7772700000361_443x443.jpg?v=1712345429',
            'Leche en Polvo Pil': 'https://amarket.com.bo/cdn/shop/files/7772904001461_443x443.jpg?v=1712344414',
            'Kefir Natural': 'https://amarket.com.bo/cdn/shop/files/69421084244408_443x443.jpg?v=1763038421',

            // === CATEGORÍA 2: DESPENSA ===
            'Arroz Grano de Oro': 'https://amarket.com.bo/cdn/shop/files/7771430110036_443x443.jpg?v=1712345291',
            'Arroz Popular': 'https://amarket.com.bo/cdn/shop/files/7774440880210_443x443.jpg?v=1712345565',
            'Fideo Lazzaroni Tallarín': 'https://amarket.com.bo/cdn/shop/files/7772500000004_443x443.jpg?v=1712344950',
            'Fideo Lazzaroni Codito': 'https://amarket.com.bo/cdn/shop/files/7772501001055_443x443.jpg?v=1712345402',
            'Fideo Laz. Corbata': 'https://amarket.com.bo/cdn/shop/files/4380971_443x443.jpg?v=1712345998',
            'Aceite Fino 1L': 'https://amarket.com.bo/cdn/shop/files/7773103000002_443x443.jpg?v=1712344093',
            'Aceite Fino 5L': 'https://amarket.com.bo/cdn/shop/files/7773103000415_443x443.jpg?v=1712346329',
            'Aceite de Oliva': 'https://amarket.com.bo/cdn/shop/files/8410179100050_443x443.jpg?v=1712345991',
            'Azúcar Guabirá': 'https://amarket.com.bo/cdn/shop/files/7771501000044_443x443.jpg?v=1712345302',
            'Azúcar Morena': 'https://amarket.com.bo/cdn/shop/files/7778608000175_443x443.jpg?v=1712345614',
            'Sal Yosal': 'https://amarket.com.bo/cdn/shop/files/7773096561009_443x443.jpg?v=1712344053',
            'Harina Blanca Flor': 'https://amarket.com.bo/cdn/shop/files/7772606000007_438x438.jpg?v=1712345414',
            'Harina Integral': '',
            'Avena Quaker': '',
            'Atún Van Camps Agua': '',
            'Atún Van Camps Aceite': '',
            'Sardinas Lidita': '',
            'Café Nescafé Tradición': '',
            'Té Windsor': '',
            'Salsa de Tomate Kris': '',

            // === CATEGORÍA 3: BEBIDAS ===
            'Coca Cola 3L': 'https://amarket.com.bo/cdn/shop/files/7771609001820_438x438.jpg?v=1759537956',
            'Coca Cola 2L': 'https://amarket.com.bo/cdn/shop/files/909699_438x438.jpg?v=1759538065',
            'Coca Cola Zero 2L': 'https://amarket.com.bo/cdn/shop/files/909803_b19e4d47-e0dc-46c2-86b7-4dbbde09b3fb_438x438.jpg?v=1759538085',
            'Sprite 2L': 'https://amarket.com.bo/cdn/shop/files/909704-OOA_28565f52-437e-4fb6-bb2c-feb23c999268_438x438.jpg?v=1763990348',
            'Fanta Naranja 2L': 'https://amarket.com.bo/cdn/shop/files/909702_438x438.jpg?v=1761662906',
            'Pepsi 3L': '',
            'Agua Vital 2L': '',
            'Agua Vital 2L Gas': '',
            'Agua Somos 2L': '',
            'Jugo Del Valle Durazno': '',
            'Jugo Del Valle Naranja': '',
            'Cerveza Paceña': '',
            'Cerveza Paceña Botella': '',
            'Cerveza Huari': '',
            'Maltín': '',
            'Powerade Azul': '',
            'Monster Energy': '',
            'Vino Kohlberg Tinto': '',
            'Singani Casa Real': '',
            'Fernet Branca': '',

            // === CATEGORÍA 4: LIMPIEZA (OJO: Lavavajillas Ola se maneja al final) ===
            'Detergente OMO 2kg': 'https://amarket.com.bo/cdn/shop/files/7779970674865_438x438.jpg?v=1712344376',
            'Detergente OMO 800g': 'https://amarket.com.bo/cdn/shop/files/7779970674575_438x438.jpg?v=1712344372',
            'Detergente Surf': 'https://amarket.com.bo/cdn/shop/files/7779970830780_438x438.jpg?v=1739977281',
            'Lavandina Ayudín': 'https://amarket.com.bo/cdn/shop/files/7775501000134_438x438.jpg?v=1723828969',
            'Lavandina Ayudín Ropa': 'https://amarket.com.bo/cdn/shop/files/7775000011945_438x438.jpg?v=1735844237',
            'Limpiavidrios Vidrex': '',
            'Desengrasante MrMusculo': '',
            'Papel Higiénico Elite': '',
            'Papel Higiénico Rosal': '',
            'Servilletas Elite': '',
            'Toallas Cocina Scott': '',
            'Suavizante Downy': '',
            'Jabón de Ropa Bolívar': '',
            'Esponja Scotch Brite': '',
            'Virutilana': '',
            'Bolsas de Basura': '',
            'Ambientador Glade': '',
            'Insecticida Baygon': '',

            // === CATEGORÍA 5: CARNES ===
            'Pollo Sofía Entero': 'https://amarket.com.bo/cdn/shop/files/9000301_438x438.jpg?v=1712346092',
            'Pechuga de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000305_438x438.jpg?v=1712346089',
            'Muslos de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000304_438x438.jpg?v=1712346090',
            'Alitas de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000302_438x438.jpg?v=1712346091',
            'Carne Molida Especial': '',
            'Carne Molida Corriente': '',
            'Bife de Chorizo': '',
            'Punta de S': '',
            'Lomo Fino': '',
            'Chuleta de Res': '',
            'Chuleta de Cerdo': '',
            'Costilla de Cerdo': '',
            'Salchicha Viena': '',
            'Salchicha Sofía': '',
            'Chorizo Parrillero': '',
            'Chorizo Chuquisaqueño': '',
            'Mortadela Jamonada': '',
            'Jamón de Cerdo': '',
            'Tocino Ahumado': '',
            'Hamburguesas Sofía': '',

            // === CATEGORÍA 6: SNACKS (OJO: Pringles se maneja al final) ===
            'Lay\'s Clásicas': 'https://amarket.com.bo/cdn/shop/files/7758574005558_438x438.jpg?v=1712347193',
            'Doritos Queso': 'https://amarket.com.bo/cdn/shop/files/7758574005473_438x438.jpg?v=1741797884',
            'Chizitos Krunchy': 'https://amarket.com.bo/cdn/shop/files/7772500000790_438x438.jpg?v=1712345399',
            'Nachos Tostitos': 'https://amarket.com.bo/cdn/shop/files/7771258300145_438x438.jpg?v=1712346843',
            'Galletas Oreo': 'https://amarket.com.bo/cdn/shop/files/7750168268417_438x438.jpg?v=1714843880',
            'Galletas Mabel\'s': 'https://amarket.com.bo/cdn/shop/files/7773401006980_438x438.jpg?v=1712344244',
            'Galletas Salvado': '',
            'Chocolate Sublime': '',
            'Chocolate Trento': '',
            'Bombones Bon o Bon': '',
            'M&M Chocolate': '',
            'Gomitas Mogul': '',
            'Chicle Beldent': '',
            'Tutucas Dulces': '',
            'Pipocas para Microondas': '',
            'Maní Salado': '',
            'Almendras': '',
            'Barra de Cereal': ''
        };

        // 1. EJECUCIÓN MASIVA (Para la lista de arriba)
        let count = 0;
        for (const [name, url] of Object.entries(imageMap)) {
            if (url && url.trim() !== '') {
                // Escapamos comillas simples en nombres como Lay's
                const safeName = name.replace(/'/g, "''");
                await queryRunner.query(
                    `UPDATE products SET image_url = '${url}' WHERE name ILIKE '${safeName}%'`
                );
                count++;
            }
        }
        console.log(`✅ Productos actualizados: ${count}`);

        // =================================================================================
        // 2. CASOS ESPECIALES (DUPLICADOS) - LLENA ESTOS TAMBIÉN
        // =================================================================================
        
        // --- Lavavajillas Ola ---
        const olaLimon = 'https://amarket.com.bo/cdn/shop/files/7779970830438_438x438.jpg?v=1735844246'; // Link Ola Limón (Verde)
        const olaManzana = 'https://amarket.com.bo/cdn/shop/files/7779970830445_438x438.jpg?v=1720560154'; // Link Ola Manzana (Roja/Amarilla)

        if (olaLimon) await queryRunner.query(`UPDATE products SET image_url = '${olaLimon}' WHERE name = 'Lavavajillas Ola' AND description ILIKE '%Limón%'`);
        if (olaManzana) await queryRunner.query(`UPDATE products SET image_url = '${olaManzana}' WHERE name = 'Lavavajillas Ola' AND description ILIKE '%Manzana%'`);

        // --- Papas Pringles ---
        const pringlesOriginal = 'https://amarket.com.bo/cdn/shop/files/38000184932_438x438.jpg?v=1712347272'; // Link Pringles Roja
        const pringlesCebolla = 'https://amarket.com.bo/cdn/shop/files/038000845260_438x438.jpg?v=1720886626'; // Link Pringles Verde

        if (pringlesOriginal) await queryRunner.query(`UPDATE products SET image_url = '${pringlesOriginal}' WHERE name = 'Papas Pringles' AND description ILIKE '%Original%'`);
        if (pringlesCebolla) await queryRunner.query(`UPDATE products SET image_url = '${pringlesCebolla}' WHERE name = 'Papas Pringles' AND description ILIKE '%Cebolla%'`);
        
        console.log("✅ Casos especiales completados.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No hace falta revertir
    }
}