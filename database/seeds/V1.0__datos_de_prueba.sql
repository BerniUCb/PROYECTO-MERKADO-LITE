-- =================================================================
-- PASO 1: CREAR LOS USUARIOS BÁSICOS
-- (Usamos un hash falso. El backend debe usar 'bcrypt' para el real)
-- =================================================================
INSERT INTO Usuario (nombre_completo, email, password_hash, rol) 
VALUES 
    ('Admin General', 'admin@merkado.com', '$2b$10$NotARealHashPlaceholder', 'Administrador'),
    ('Cliente de Prueba', 'cliente@example.com', '$2b$10$NotARealHashPlaceholder', 'Cliente'),
    ('Repartidor Uno', 'repartidor@merkado.com', '$2b$10$NotARealHashPlaceholder', 'Repartidor')
ON CONFLICT (email) DO NOTHING; -- No falla si ya los insertaste


-- =================================================================
-- PASO 2: CREAR LAS CATEGORÍAS (SECCIONES)
-- =================================================================
INSERT INTO Categoria (nombre, descripcion)
VALUES
    ('Mascotas', 'Alimentos y accesorios para mascotas'),
    ('Sector Gourmet', 'Productos importados y delicatessen'),
    ('Bebidas Alcohólicas', 'Vinos, cervezas y licores'),
    ('Panetones', 'Panetones y productos de temporada navideña')
ON CONFLICT (nombre) DO NOTHING; -- No falla si ya las insertaste


-- =================================================================
-- PASO 3: INSERTAR LOS PRODUCTOS DE PRUEBA
-- (Asignamos el stock y el categoria_id manualmente)
-- =================================================================
INSERT INTO Producto (nombre, precio_venta, stock_disponible, categoria_id)
VALUES
    -- Mascotas (Asumimos que categoria_id es 4)
    ('Comida para perro Dog Chow 2kg', 95.00, 50, (SELECT categoria_id FROM Categoria WHERE nombre = 'Mascotas')),
    ('Arena para gato Mishi 5kg', 55.00, 30, (SELECT categoria_id FROM Categoria WHERE nombre = 'Mascotas')),

    -- Sector Gourmet (Asumimos que categoria_id es 5)
    ('Queso de cabra madurado 250g', 68.00, 20, (SELECT categoria_id FROM Categoria WHERE nombre = 'Sector Gourmet')),
    ('Aceite de Oliva Extra Virgen 500ml', 75.00, 25, (SELECT categoria_id FROM Categoria WHERE nombre = 'Sector Gourmet')),

    -- Bebidas Alcohólicas (Asumimos que categoria_id es 6)
    ('Vino Tinto Aranjuez 750ml', 85.00, 40, (SELECT categoria_id FROM Categoria WHERE nombre = 'Bebidas Alcohólicas')),
    ('Cerveza Paceña 1L (Pack 6)', 60.00, 30, (SELECT categoria_id FROM Categoria WHERE nombre = 'Bebidas Alcohólicas')),

    -- Panetones (Asumimos que categoria_id es 7)
    ('Panetón D''Onofrio Caja 900g', 70.00, 100, (SELECT categoria_id FROM Categoria WHERE nombre = 'Panetones')),
    ('Panetón Bauducco Frutas 750g', 65.00, 80, (SELECT categoria_id FROM Categoria WHERE nombre = 'Panetones'))
ON CONFLICT DO NOTHING; -- Evita errores si corres el script dos veces