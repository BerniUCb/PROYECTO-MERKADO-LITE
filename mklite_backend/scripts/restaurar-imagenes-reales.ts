// Script para restaurar imágenes reales (URLs estáticas)
// Ubicación: scripts/restaurar-imagenes-reales.ts
// Ejecutar desde la raíz del backend: npx ts-node -r tsconfig-paths/register scripts/restaurar-imagenes-reales.ts

import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../src/data-source';

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
    'Leche Condensada Nestlé': 'https://amarket.com.bo/cdn/shop/files/7771257660349_647x647.jpg?v=1712345254',
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
    'Harina Integral': 'https://amarket.com.bo/cdn/shop/files/7772606000182_869x869.jpg?v=1712345411',
    'Avena Quaker': 'https://amarket.com.bo/cdn/shop/files/900214_869x869.jpg?v=1712344456',
    'Atún Van Camps Agua': 'https://amarket.com.bo/cdn/shop/files/7702367000022_590x590.jpg?v=1712344567',
    'Atún Van Camps Aceite': 'https://amarket.com.bo/cdn/shop/files/7702367047294_869x869.jpg?v=1723828891',
    'Sardinas Lidita': 'https://amarket.com.bo/cdn/shop/files/7862100600602_869x869.jpg?v=1720560179',
    'Café Nescafé Tradición': 'https://amarket.com.bo/cdn/shop/files/7891000284230_869x869.jpg?v=1751291483',
    'Té Windsor': 'https://amarket.com.bo/cdn/shop/files/07771802001078_869x869.jpg?v=1712345052',
    'Salsa de Tomate Kris': 'https://amarket.com.bo/cdn/shop/files/7891300909864_869x869.jpg?v=1712347239',

    // === CATEGORÍA 3: BEBIDAS ===
    'Coca Cola 3L': 'https://amarket.com.bo/cdn/shop/files/7771609001820_438x438.jpg?v=1759537956',
    'Coca Cola 2L': 'https://amarket.com.bo/cdn/shop/files/909699_438x438.jpg?v=1759538065',
    'Coca Cola Zero 2L': 'https://amarket.com.bo/cdn/shop/files/909803_b19e4d47-e0dc-46c2-86b7-4dbbde09b3fb_438x438.jpg?v=1759538085',
    'Sprite 2L': 'https://amarket.com.bo/cdn/shop/files/909704-OOA_28565f52-437e-4fb6-bb2c-feb23c999268_438x438.jpg?v=1763990348',
    'Fanta Naranja 2L': 'https://amarket.com.bo/cdn/shop/files/909702_438x438.jpg?v=1761662906',
    'Pepsi 3L': 'https://amarket.com.bo/cdn/shop/files/7772106002877_869x869.jpg?v=1712343876',
    'Agua Vital 2L': 'https://amarket.com.bo/cdn/shop/files/909706_6e38813d-0a3f-4267-8068-b490ef775d8b_869x869.jpg?v=1759538075',
    'Agua Vital 2L Gas': 'https://amarket.com.bo/cdn/shop/files/909715_869x869.jpg?v=1712343848',
    'Agua Somos 2L': 'https://amarket.com.bo/cdn/shop/files/7772106007438_869x869.jpg?v=1712344523',
    'Jugo Del Valle Durazno': 'https://amarket.com.bo/cdn/shop/files/7771609003817_869x869.jpg?v=1718298705',
    'Jugo Del Valle Naranja': 'https://amarket.com.bo/cdn/shop/files/7771260010407_590x590.jpg?v=1712344477',
    'Cerveza Paceña': 'https://amarket.com.bo/cdn/shop/files/7772106007469_869x869.jpg?v=1746211972',
    'Cerveza Paceña Botella': 'https://amarket.com.bo/cdn/shop/files/7891991014762_869x869.jpg?v=1753283636',
    'Cerveza Huari': 'https://amarket.com.bo/cdn/shop/files/7772106009050_869x869.jpg?v=1723041059',
    'Maltín': 'https://amarket.com.bo/cdn/shop/files/7772116030723_869x869.jpg?v=1723040945',
    'Powerade Azul': 'https://amarket.com.bo/cdn/shop/files/foto_power_azul_473_869x869.png?v=1765560876',
    'Monster Energy': 'https://amarket.com.bo/cdn/shop/files/070847028406_869x869.jpg?v=1759537904',
    'Vino Kohlberg Tinto': 'https://amarket.com.bo/cdn/shop/files/7772107000094_869x869.jpg?v=1712346402',
    'Singani Casa Real': 'https://amarket.com.bo/cdn/shop/files/7771612000001_869x869.jpg?v=1724683880',
    'Fernet Branca': 'https://amarket.com.bo/cdn/shop/files/7790290000523_869x869.jpg?v=1712344933',

    // === CATEGORÍA 4: LIMPIEZA ===
    'Detergente OMO 2kg': 'https://amarket.com.bo/cdn/shop/files/7779970674865_438x438.jpg?v=1712344376',
    'Detergente OMO 800g': 'https://amarket.com.bo/cdn/shop/files/7779970674575_438x438.jpg?v=1712344372',
    'Detergente Surf': 'https://amarket.com.bo/cdn/shop/files/7779970830780_438x438.jpg?v=1739977281',
    'Lavandina Ayudín': 'https://amarket.com.bo/cdn/shop/files/7775501000134_438x438.jpg?v=1723828969',
    'Lavandina Ayudín Ropa': 'https://amarket.com.bo/cdn/shop/files/7775000011945_438x438.jpg?v=1735844237',
    'Limpiavidrios Vidrex': 'https://amarket.com.bo/cdn/shop/files/07775000006170_869x869.jpg?v=1712344360',
    'Desengrasante MrMusculo': 'https://amarket.com.bo/cdn/shop/files/07775000006217_869x869.jpg?v=1712344363',
    'Papel Higiénico Elite': 'https://amarket.com.bo/cdn/shop/files/7759185005234_869x869.jpg?v=1723828902',
    'Papel Higiénico Rosal': 'https://amarket.com.bo/cdn/shop/files/7776507001453_869x869.jpg?v=1712346936',
    'Servilletas Elite': 'https://amarket.com.bo/cdn/shop/files/7759185003544_869x869.jpg?v=1734546727',
    'Toallas Cocina Scott': 'https://amarket.com.bo/cdn/shop/files/7776501005006_869x869.jpg?v=1712344484',
    'Suavizante Downy': 'https://amarket.com.bo/cdn/shop/files/7500435139168_869x869.jpg?v=1712345002',
    'Jabón de Ropa Bolívar': 'https://amarket.com.bo/cdn/shop/files/7750243068826_869x869.jpg?v=1712346417',
    'Esponja Scotch Brite': 'https://amarket.com.bo/cdn/shop/files/0110086_869x869.jpg?v=1712344891',
    'Virutilana': 'https://amarket.com.bo/cdn/shop/files/7891040128082_869x869.jpg?v=1736256279',
    'Bolsas de Basura': 'https://amarket.com.bo/cdn/shop/files/010900145015_869x869.jpg?v=1712345532',
    'Ambientador Glade': 'https://amarket.com.bo/cdn/shop/files/7790520998262_869x869.jpg?v=1712347208',
    'Insecticida Baygon': 'https://amarket.com.bo/cdn/shop/files/7501032931131_869x869.jpg?v=1712345010',

    // === CATEGORÍA 5: CARNES ===
    'Pollo Sofía Entero': 'https://amarket.com.bo/cdn/shop/files/9000301_438x438.jpg?v=1712346092',
    'Pechuga de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000305_438x438.jpg?v=1712346089',
    'Muslos de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000304_438x438.jpg?v=1712346090',
    'Alitas de Pollo': 'https://amarket.com.bo/cdn/shop/files/9000302_438x438.jpg?v=1712346091',
    'Carne Molida Especial': 'https://amarket.com.bo/cdn/shop/files/9000507_869x869.jpg?v=1712343862',
    'Carne Molida Corriente': 'https://amarket.com.bo/cdn/shop/files/9000178_869x869.jpg?v=1712346079',
    'Bife de Chorizo': 'https://amarket.com.bo/cdn/shop/files/9000374_2f842026-924b-4d9e-8706-4c32a054bcc4_869x869.jpg?v=1748537482',
    'Punta de S': 'https://amarket.com.bo/cdn/shop/files/9000494_869x869.jpg?v=1712347274',
    'Lomo Fino': 'https://amarket.com.bo/cdn/shop/files/7771258770023_869x869.jpg?v=1712345268',
    'Chuleta de Res': 'https://amarket.com.bo/cdn/shop/files/9000185_869x869.jpg?v=1712346075',
    'Chuleta de Cerdo': 'https://amarket.com.bo/cdn/shop/files/7770109220045_869x869.jpg?v=1712347252',
    'Costilla de Cerdo': 'https://amarket.com.bo/cdn/shop/files/511226_869x869.jpg?v=1712346181',
    'Salchicha Viena': 'https://amarket.com.bo/cdn/shop/files/9000510_869x869.jpg?v=1712343848',
    'Salchicha Sofía': 'https://amarket.com.bo/cdn/shop/files/534511_869x869.jpg?v=1712346194',
    'Chorizo Parrillero': 'https://amarket.com.bo/cdn/shop/files/900901062827_869x869.jpg?v=1712346194',
    'Chorizo Chuquisaqueño': 'https://laporcina.com/wp-content/uploads/2020/08/Chorizo_Chuquisaqueno-1080x1025-2-768x729.png',
    'Mortadela Jamonada': 'https://amarket.com.bo/cdn/shop/files/360031_869x869.jpg?v=1712345786',
    'Jamón de Cerdo': 'https://laporcina.com/wp-content/uploads/2020/08/Mortadela-jamonada-768x729.png',
    'Tocino Ahumado': 'https://amarket.com.bo/cdn/shop/files/9000422_869x869.jpg?v=1712346118',
    'Hamburguesas Sofía': 'https://amarket.com.bo/cdn/shop/files/07774112100332_869x869.jpg?v=1735843885',

    // === CATEGORÍA 6: SNACKS ===
    'Lay\'s Clásicas': 'https://amarket.com.bo/cdn/shop/files/7758574005558_438x438.jpg?v=1712347193',
    'Doritos Queso': 'https://amarket.com.bo/cdn/shop/files/7758574005473_438x438.jpg?v=1741797884',
    'Chizitos Krunchy': 'https://amarket.com.bo/cdn/shop/files/7772500000790_438x438.jpg?v=1712345399',
    'Nachos Tostitos': 'https://amarket.com.bo/cdn/shop/files/7771258300145_438x438.jpg?v=1712346843',
    'Galletas Oreo': 'https://amarket.com.bo/cdn/shop/files/7750168268417_438x438.jpg?v=1714843880',
    'Galletas Mabel\'s': 'https://amarket.com.bo/cdn/shop/files/7773401006980_438x438.jpg?v=1712344244',
    'Galletas Salvado': 'https://amarket.com.bo/cdn/shop/files/7773401001862_869x869.jpg?v=1712344244',
    'Chocolate Sublime': 'https://amarket.com.bo/cdn/shop/files/8445291336025_869x869.jpg?v=1736256302',
    'Chocolate Trento': 'https://amarket.com.bo/cdn/shop/files/7771718010713_869x869.jpg?v=1712346678',
    'Bombones Bon o Bon': 'https://amarket.com.bo/cdn/shop/files/7790580119133_590x590.jpg?v=1712343899',
    'M&M Chocolate': 'https://amarket.com.bo/cdn/shop/files/7730963251081_590x590.jpg?v=1712344432',
    'Gomitas Mogul': 'https://amarket.com.bo/cdn/shop/files/7790580259600_590x590.jpg?v=1712344275',
    'Chicle Beldent': 'https://amarket.com.bo/cdn/shop/files/80916642_869x869.jpg?v=1720560217',
    'Tutucas Dulces': 'https://amarket.com.bo/cdn/shop/files/7798186030531_869x869.jpg?v=1712346974',
    'Pipocas para Microondas': 'https://amarket.com.bo/cdn/shop/files/76150200393_590x590.jpg?v=1712343875',
    'Maní Salado': 'https://amarket.com.bo/cdn/shop/files/7790524324432_869x869.jpg?v=1758901343',
    'Almendras': 'https://amarket.com.bo/cdn/shop/files/7772622080229_293x293.jpg?v=1712344303',
    'Barra de Cereal': 'https://amarket.com.bo/cdn/shop/files/77916525_869x869.jpg?v=1712343975'
};

async function restaurarImagenesReales() {
    const dataSource = new DataSource(dataSourceOptions);
    
    try {
        await dataSource.initialize();
        console.log("🖼️ Restaurando imágenes reales (URLs estáticas)...");

        let count = 0;
        for (const [name, url] of Object.entries(imageMap)) {
            if (url && url.trim() !== '') {
                const safeName = name.replace(/'/g, "''");
                await dataSource.query(
                    `UPDATE products SET image_url = $1 WHERE name ILIKE $2`,
                    [url, `${safeName}%`]
                );
                count++;
            }
        }
        console.log(`✅ Productos actualizados: ${count}`);

        // Casos especiales (productos duplicados con diferentes variantes)
        const olaLimon = 'https://amarket.com.bo/cdn/shop/files/7779970830438_438x438.jpg?v=1735844246';
        const olaManzana = 'https://amarket.com.bo/cdn/shop/files/7779970830445_438x438.jpg?v=1720560154';
        const pringlesOriginal = 'https://amarket.com.bo/cdn/shop/files/38000184932_438x438.jpg?v=1712347272';
        const pringlesCebolla = 'https://amarket.com.bo/cdn/shop/files/038000845260_438x438.jpg?v=1720886626';

        if (olaLimon) await dataSource.query(`UPDATE products SET image_url = $1 WHERE name = $2 AND description ILIKE $3`, [olaLimon, 'Lavavajillas Ola', '%Limón%']);
        if (olaManzana) await dataSource.query(`UPDATE products SET image_url = $1 WHERE name = $2 AND description ILIKE $3`, [olaManzana, 'Lavavajillas Ola', '%Manzana%']);
        if (pringlesOriginal) await dataSource.query(`UPDATE products SET image_url = $1 WHERE name = $2 AND description ILIKE $3`, [pringlesOriginal, 'Papas Pringles', '%Original%']);
        if (pringlesCebolla) await dataSource.query(`UPDATE products SET image_url = $1 WHERE name = $2 AND description ILIKE $3`, [pringlesCebolla, 'Papas Pringles', '%Cebolla%']);
        
        console.log("✅ Casos especiales completados.");
        console.log("🎉 ¡Todas las imágenes han sido restauradas!");
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await dataSource.destroy();
    }
}

restaurarImagenesReales();

