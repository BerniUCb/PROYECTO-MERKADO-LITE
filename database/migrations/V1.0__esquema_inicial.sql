-- 1. Tabla de Proveedores (Entidad: Proveedor)
CREATE TABLE Proveedor (
    proveedor_id SERIAL PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    contacto_nombre VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(50),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Lotes (Entidad: Lote)
CREATE TABLE Lote (
    lote_id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    proveedor_id INT,
    cantidad_recibida INT NOT NULL,
    cantidad_actual INT NOT NULL,
    costo_distribuidor NUMERIC(10, 2),
    fecha_recibida DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id),
    FOREIGN KEY (proveedor_id) REFERENCES Proveedor(proveedor_id)
);
-- 3. Tabla de Movimientos de Stock (Entidad: Movimiento Stock)
CREATE TYPE tipo_movimiento AS ENUM (
    'entrada_compra',
    'salida_venta',
    'ajuste_vencido',
    'ajuste_devolucion'
);

CREATE TABLE Movimiento_Stock (
    movimiento_id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL,
    lote_id INT, 
    cantidad INT NOT NULL, 
    tipo tipo_movimiento NOT NULL,
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT, 
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id),
    FOREIGN KEY (lote_id) REFERENCES Lote(lote_id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
);

-- 4. Tabla de Promociones (Entidad: Promocion)
CREATE TABLE Promocion (
    promocion_id SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    tipo_descuento VARCHAR(20),
    valor_descuento NUMERIC(10, 2),
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    producto_id INT,
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id)
);
CREATE TABLE Envio (
    envio_id SERIAL PRIMARY KEY,
    
    -- La conexión al pedido que se envía
    pedido_id INT NOT NULL UNIQUE, -- Un pedido solo tiene un envío
    
    -- El usuario (con rol 'Repartidor') asignado
    repartidor_id INT, -- Puede ser NULL al inicio, hasta que un repartidor lo tome
    
    -- El estado del envío (podemos reusar el ENUM que ya creamos)
    estado estado_pedido NOT NULL DEFAULT 'pendiente',
    
    fecha_asignacion TIMESTAMP WITH TIME ZONE,
    fecha_entrega_estimada TIMESTAMP WITH TIME ZONE,
    fecha_entregado TIMESTAMP WITH TIME ZONE,
    
    FOREIGN KEY (pedido_id) REFERENCES Pedido(pedido_id),
    FOREIGN KEY (repartidor_id) REFERENCES Usuario(usuario_id)
);

-- Esta tabla guarda los productos que un cliente tiene en su carrito.
CREATE TABLE Carrito_Item (
    carrito_item_id SERIAL PRIMARY KEY,
    
    -- El cliente (con rol 'Cliente') dueño de este item
    cliente_id INT NOT NULL,
    
    -- El producto en el carrito
    producto_id INT NOT NULL,
    
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Esto asegura que un cliente no pueda tener el mismo producto dos veces
    -- en el carrito (lo obliga a sumar la cantidad)
    UNIQUE(cliente_id, producto_id), 
    
    FOREIGN KEY (cliente_id) REFERENCES Usuario(usuario_id),
    FOREIGN KEY (producto_id) REFERENCES Producto(producto_id)
);


-- Para cumplir con la HU16
CREATE TABLE Calificacion (
    calificacion_id SERIAL PRIMARY KEY,
    
    -- El pedido (o envío) que se está calificando
    pedido_id INT NOT NULL UNIQUE, -- Un pedido solo se califica una vez
    
    -- El cliente que califica
    cliente_id INT NOT NULL,
    
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_calificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pedido_id) REFERENCES Pedido(pedido_id),
    FOREIGN KEY (cliente_id) REFERENCES Usuario(usuario_id)
);