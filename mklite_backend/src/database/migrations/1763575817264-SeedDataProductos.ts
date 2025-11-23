import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDataProductos1763575817264 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. LIMPIEZA (Para evitar duplicados si re-corres migraciones en dev)
        // Usamos CASCADE para borrar productos al borrar categorías, pero reiniciamos IDs
        await queryRunner.query(`TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE;`);

        // 2. INSERTAR CATEGORÍAS
        await queryRunner.query(`
            INSERT INTO categories (category_id, name, description) VALUES 
            (1, 'Lácteos y Derivados', 'Leche, quesos, yogurts y cremas.'),
            (2, 'Despensa y Abarrotes', 'Productos básicos, granos y conservas.'),
            (3, 'Bebidas', 'Gaseosas, jugos, aguas y cervezas.'),
            (4, 'Limpieza del Hogar', 'Detergentes, desinfectantes y aseo.'),
            (5, 'Carnes y Embutidos', 'Pollo, res, cerdo y fiambres.'),
            (6, 'Snacks y Golosinas', 'Papas, galletas, chocolates y dulces.');
        `);

        // Ajustar secuencia de Categorías
        await queryRunner.query(`SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));`);

        // 3. INSERTAR PRODUCTOS (120 Ítems - 20 por Categoría)
        await queryRunner.query(`
            INSERT INTO products (name, description, sale_price, physical_stock, reserved_stock, unit_of_measure, is_active, category_id) VALUES 
            
            -- === CATEGORÍA 1: LÁCTEOS (20 ítems) ===
            ('Leche Pil Entera 1L', 'Leche pasteurizada bolsa.', 7.00, 150, 0, 'Litro', true, 1),
            ('Leche Pil Light 1L', 'Leche descremada bolsa.', 7.50, 100, 0, 'Litro', true, 1),
            ('Leche Pil Deslactosada', 'Bolsa de 1 litro.', 8.00, 80, 0, 'Litro', true, 1),
            ('Leche Chocolatada Pil', 'Bolsa escolar 200ml.', 2.50, 200, 0, 'Unidad', true, 1),
            ('Yogurt Bebible Frutilla', 'Pil botella 2 litros.', 16.50, 60, 0, 'Unidad', true, 1),
            ('Yogurt Bebible Durazno', 'Pil botella 2 litros.', 16.50, 60, 0, 'Unidad', true, 1),
            ('Yogurt Griego Natural', 'Pote personal 150g.', 5.50, 40, 0, 'Unidad', true, 1),
            ('Mantequilla Regia c/Sal', 'Paquete 200g.', 12.00, 50, 0, 'Unidad', true, 1),
            ('Mantequilla Regia s/Sal', 'Paquete 200g.', 12.50, 30, 0, 'Unidad', true, 1),
            ('Queso Menonita', 'Fresco por kilo.', 38.00, 25, 0, 'Kg', true, 1),
            ('Queso Edam Pil', 'Pieza de 500g.', 35.00, 20, 0, 'Unidad', true, 1),
            ('Queso Mozzarella', 'Ideal para pizza, por Kg.', 42.00, 15, 0, 'Kg', true, 1),
            ('Queso Crema Pil', 'Pote untable 250g.', 14.00, 40, 0, 'Unidad', true, 1),
            ('Leche Condensada Nestlé', 'Lata 397g.', 11.50, 70, 0, 'Unidad', true, 1),
            ('Leche Evaporada Gloria', 'Lata 400g.', 10.00, 60, 0, 'Unidad', true, 1),
            ('Crema de Leche Pil', 'Bolsa 900ml.', 22.00, 30, 0, 'Unidad', true, 1),
            ('Dulce de Leche Pil', 'Pote 500g.', 15.00, 45, 0, 'Unidad', true, 1),
            ('Helado Cabrera 2L', 'Sabor Tres Leches.', 35.00, 20, 0, 'Unidad', true, 1),
            ('Leche en Polvo Pil', 'Lata 2.5kg.', 85.00, 10, 0, 'Unidad', true, 1),
            ('Kefir Natural', 'Botella 500ml artesanal.', 18.00, 15, 0, 'Unidad', true, 1),

            -- === CATEGORÍA 2: DESPENSA (20 ítems) ===
            ('Arroz Grano de Oro', 'Grano largo seleccionado 1kg.', 9.50, 200, 0, 'Kg', true, 2),
            ('Arroz Popular', 'Arroz a granel.', 6.50, 300, 0, 'Kg', true, 2),
            ('Fideo Lazzaroni Tallarín', 'Paquete 400g.', 5.50, 150, 0, 'Unidad', true, 2),
            ('Fideo Lazzaroni Codito', 'Paquete 400g.', 5.50, 150, 0, 'Unidad', true, 2),
            ('Fideo Laz. Corbata', 'Paquete 400g.', 5.50, 150, 0, 'Unidad', true, 2),
            ('Aceite Fino 1L', 'Aceite de soya.', 14.00, 120, 0, 'Litro', true, 2),
            ('Aceite Fino 5L', 'Galón familiar.', 65.00, 40, 0, 'Unidad', true, 2),
            ('Aceite de Oliva', 'Extra virgen 500ml.', 45.00, 20, 0, 'Unidad', true, 2),
            ('Azúcar Guabirá', 'Refinada 1kg.', 6.00, 250, 0, 'Kg', true, 2),
            ('Azúcar Morena', 'Aguaí 1kg.', 7.00, 100, 0, 'Kg', true, 2),
            ('Sal Yosal', 'Yodada bolsa 1kg.', 2.00, 300, 0, 'Kg', true, 2),
            ('Harina Blanca Flor', '000 fortificada 1kg.', 7.50, 80, 0, 'Kg', true, 2),
            ('Harina Integral', 'Nutrigo 1kg.', 9.00, 40, 0, 'Kg', true, 2),
            ('Avena Quaker', 'Laminada bolsa 400g.', 8.50, 90, 0, 'Unidad', true, 2),
            ('Atún Van Camps Agua', 'Lata 170g.', 11.00, 100, 0, 'Unidad', true, 2),
            ('Atún Van Camps Aceite', 'Lata 170g.', 11.00, 100, 0, 'Unidad', true, 2),
            ('Sardinas Lidita', 'En salsa de tomate.', 9.00, 80, 0, 'Unidad', true, 2),
            ('Café Nescafé Tradición', 'Frasco 200g.', 35.00, 50, 0, 'Unidad', true, 2),
            ('Té Windsor', 'Caja 20 unidades canela.', 5.00, 100, 0, 'Unidad', true, 2),
            ('Salsa de Tomate Kris', 'Ketchup sachet 200g.', 4.50, 150, 0, 'Unidad', true, 2),

            -- === CATEGORÍA 3: BEBIDAS (20 ítems) ===
            ('Coca Cola 3L', 'Original Retornable.', 13.00, 200, 0, 'Unidad', true, 3),
            ('Coca Cola 2L', 'No Retornable.', 11.00, 150, 0, 'Unidad', true, 3),
            ('Coca Cola Zero 2L', 'Sin azúcar.', 11.00, 80, 0, 'Unidad', true, 3),
            ('Sprite 2L', 'Sabor limón.', 10.50, 100, 0, 'Unidad', true, 3),
            ('Fanta Naranja 2L', 'Sabor naranja.', 10.50, 100, 0, 'Unidad', true, 3),
            ('Pepsi 3L', 'Botella grande.', 12.00, 80, 0, 'Unidad', true, 3),
            ('Agua Vital 2L', 'Sin gas.', 6.00, 150, 0, 'Unidad', true, 3),
            ('Agua Vital 2L Gas', 'Con gas.', 6.00, 100, 0, 'Unidad', true, 3),
            ('Agua Somos 2L', 'Alcalina.', 7.00, 50, 0, 'Unidad', true, 3),
            ('Jugo Del Valle Durazno', 'Botella 1L.', 10.00, 90, 0, 'Unidad', true, 3),
            ('Jugo Del Valle Naranja', 'Botella 1L.', 10.00, 90, 0, 'Unidad', true, 3),
            ('Cerveza Paceña', 'Lata Centenario 354ml.', 9.00, 300, 0, 'Unidad', true, 3),
            ('Cerveza Paceña Botella', 'Margarita 620ml.', 14.00, 200, 0, 'Unidad', true, 3),
            ('Cerveza Huari', 'Botella 330ml.', 12.00, 100, 0, 'Unidad', true, 3),
            ('Maltín', 'Bebida de malta sin alcohol.', 7.00, 80, 0, 'Unidad', true, 3),
            ('Powerade Azul', 'Isotónica 500ml.', 8.00, 60, 0, 'Unidad', true, 3),
            ('Monster Energy', 'Lata original.', 18.00, 50, 0, 'Unidad', true, 3),
            ('Vino Kohlberg Tinto', 'Botella 750ml.', 35.00, 40, 0, 'Unidad', true, 3),
            ('Singani Casa Real', 'Etiqueta negra 750ml.', 85.00, 30, 0, 'Unidad', true, 3),
            ('Fernet Branca', 'Botella 750ml.', 75.00, 40, 0, 'Unidad', true, 3),

            -- === CATEGORÍA 4: LIMPIEZA (20 ítems) ===
            ('Detergente OMO 2kg', 'Multiacción.', 34.00, 60, 0, 'Unidad', true, 4),
            ('Detergente OMO 800g', 'Bolsa pequeña.', 12.00, 100, 0, 'Unidad', true, 4),
            ('Detergente Surf', 'Aroma limón 1kg.', 14.00, 80, 0, 'Unidad', true, 4),
            ('Lavavajillas Ola', 'Limón 500ml.', 10.50, 90, 0, 'Unidad', true, 4),
            ('Lavavajillas Ola', 'Manzana 500ml.', 10.50, 50, 0, 'Unidad', true, 4),
            ('Lavandina Ayudín', 'Cloro 1L.', 5.00, 120, 0, 'Litro', true, 4),
            ('Lavandina Ayudín Ropa', 'Para ropa color 1L.', 12.00, 60, 0, 'Unidad', true, 4),
            ('Limpiavidrios Vidrex', 'Gatillo 500ml.', 15.00, 40, 0, 'Unidad', true, 4),
            ('Desengrasante MrMusculo', 'Cocina gatillo.', 22.00, 30, 0, 'Unidad', true, 4),
            ('Papel Higiénico Elite', 'Doble hoja 4 rollos.', 12.00, 150, 0, 'Paquete', true, 4),
            ('Papel Higiénico Rosal', 'Económico 4 rollos.', 8.00, 100, 0, 'Paquete', true, 4),
            ('Servilletas Elite', 'Paquete 100 un.', 6.00, 120, 0, 'Unidad', true, 4),
            ('Toallas Cocina Scott', 'Rollo gigante.', 14.00, 50, 0, 'Unidad', true, 4),
            ('Suavizante Downy', 'Botella 1L.', 25.00, 40, 0, 'Unidad', true, 4),
            ('Jabón de Ropa Bolívar', 'Barra 200g.', 4.50, 200, 0, 'Unidad', true, 4),
            ('Esponja Scotch Brite', 'Verde multiuso.', 3.50, 150, 0, 'Unidad', true, 4),
            ('Virutilana', 'Paquete 6 unidades.', 5.00, 80, 0, 'Paquete', true, 4),
            ('Bolsas de Basura', 'Negras grandes 10u.', 10.00, 100, 0, 'Paquete', true, 4),
            ('Ambientador Glade', 'Aerosol lavanda.', 18.00, 45, 0, 'Unidad', true, 4),
            ('Insecticida Baygon', 'Matatodo aerosol.', 24.00, 30, 0, 'Unidad', true, 4),

            -- === CATEGORÍA 5: CARNES (20 ítems) ===
            ('Pollo Sofía Entero', 'Precio por Kg.', 15.50, 80, 0, 'Kg', true, 5),
            ('Pechuga de Pollo', 'Sin hueso Sofía kg.', 26.00, 50, 0, 'Kg', true, 5),
            ('Muslos de Pollo', 'Cuartos de pollo kg.', 16.00, 60, 0, 'Kg', true, 5),
            ('Alitas de Pollo', 'Sofía bandeja.', 22.00, 40, 0, 'Unidad', true, 5),
            ('Carne Molida Especial', 'Res magra 500g.', 22.00, 60, 0, 'Unidad', true, 5),
            ('Carne Molida Corriente', 'Res 500g.', 18.00, 50, 0, 'Unidad', true, 5),
            ('Bife de Chorizo', 'Corte parrillero kg.', 45.00, 20, 0, 'Kg', true, 5),
            ('Punta de S', 'Corte parrillero kg.', 42.00, 20, 0, 'Kg', true, 5),
            ('Lomo Fino', 'Res primera kg.', 48.00, 15, 0, 'Kg', true, 5),
            ('Chuleta de Res', 'Con hueso kg.', 32.00, 30, 0, 'Kg', true, 5),
            ('Chuleta de Cerdo', 'Sofía kg.', 28.00, 40, 0, 'Kg', true, 5),
            ('Costilla de Cerdo', 'Para parrilla kg.', 35.00, 25, 0, 'Kg', true, 5),
            ('Salchicha Viena', 'Granel kg.', 25.00, 60, 0, 'Kg', true, 5),
            ('Salchicha Sofía', 'Paquete al vacío 500g.', 18.00, 100, 0, 'Unidad', true, 5),
            ('Chorizo Parrillero', 'Picante kg.', 38.00, 30, 0, 'Kg', true, 5),
            ('Chorizo Chuquisaqueño', '7 Lunares kg.', 45.00, 20, 0, 'Kg', true, 5),
            ('Mortadela Jamonada', 'Pieza 200g.', 8.00, 50, 0, 'Unidad', true, 5),
            ('Jamón de Cerdo', 'Feteado 200g.', 15.00, 40, 0, 'Unidad', true, 5),
            ('Tocino Ahumado', 'Tiras 200g.', 25.00, 30, 0, 'Unidad', true, 5),
            ('Hamburguesas Sofía', 'Caja 4 unidades.', 18.00, 60, 0, 'Unidad', true, 5),

            -- === CATEGORÍA 6: SNACKS (20 ítems) ===
            ('Papas Pringles', 'Original lata chica.', 18.00, 50, 0, 'Unidad', true, 6),
            ('Papas Pringles', 'Cebolla lata chica.', 18.00, 40, 0, 'Unidad', true, 6),
            ('Lay''s Clásicas', 'Bolsa aireada.', 10.00, 60, 0, 'Unidad', true, 6),
            ('Doritos Queso', 'Bolsa grande.', 15.00, 50, 0, 'Unidad', true, 6),
            ('Chizitos Krunchy', 'Bolsa escolar.', 2.00, 150, 0, 'Unidad', true, 6),
            ('Nachos Tostitos', 'Bolsa familiar.', 25.00, 30, 0, 'Unidad', true, 6),
            ('Galletas Oreo', 'Tubo original.', 7.00, 120, 0, 'Unidad', true, 6),
            ('Galletas Mabel''s', 'Wafer sabor vainilla.', 4.50, 100, 0, 'Unidad', true, 6),
            ('Galletas Salvado', 'Integrales paquete.', 6.00, 80, 0, 'Unidad', true, 6),
            ('Chocolate Sublime', 'Barra clásica.', 4.00, 200, 0, 'Unidad', true, 6),
            ('Chocolate Trento', 'Barra rellena.', 5.00, 150, 0, 'Unidad', true, 6),
            ('Bombones Bon o Bon', 'Caja 12 unidades.', 25.00, 40, 0, 'Unidad', true, 6),
            ('M&M Chocolate', 'Bolsa 47g.', 12.00, 60, 0, 'Unidad', true, 6),
            ('Gomitas Mogul', 'Ositos ácidos.', 5.00, 100, 0, 'Unidad', true, 6),
            ('Chicle Beldent', 'Menta cajita.', 4.00, 200, 0, 'Unidad', true, 6),
            ('Tutucas Dulces', 'Bolsa grande.', 5.00, 50, 0, 'Unidad', true, 6),
            ('Pipocas para Microondas', 'Mantequilla ActII.', 8.00, 80, 0, 'Unidad', true, 6),
            ('Maní Salado', 'Kris paquete.', 6.00, 70, 0, 'Unidad', true, 6),
            ('Almendras', 'Paquete 100g.', 15.00, 40, 0, 'Unidad', true, 6),
            ('Barra de Cereal', 'Quaker frutilla.', 3.50, 90, 0, 'Unidad', true, 6);
        `);

        // Ajustar secuencia de Productos
        await queryRunner.query(`SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products));`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM products`);
        await queryRunner.query(`DELETE FROM categories`);
    }
}