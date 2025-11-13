// src/entity/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Categoria } from "./category.entity";
import { DetallePedido } from "./order-item.entity";
import { HistorialPrecio } from "./price-history.entity";

@Entity('producto')
export class Producto {

    @PrimaryGeneratedColumn({ name: 'producto_id' })
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'numeric', name: 'precio_venta' })
    precioVenta: number;

    @Column({ name: 'unidad_medida', default: 'Unidad' })
    unidadMedida: string;

// ...
    @Column({ type: 'integer', name: 'stock_fisico' }) // <-- Renombrado
    stockFisico: number;

    @Column({ type: 'integer', name: 'stock_reservado', default: 0 }) // <-- Nueva propiedad
    stockReservado: number;
// ...

    // --- ¡NUEVA PROPIEDAD AÑADIDA! ---
    @Column({ name: 'url_imagen', type: 'varchar', length: 512, nullable: true })
    urlImagen: string;
    // ------------------------------------

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    // --- Relaciones ---
    @ManyToOne(() => Categoria, (categoria) => categoria.productos)
    @JoinColumn({ name: 'categoria_id' })
    categoria: Categoria;
        // ¡NUEVA RELACIÓN! Un Producto puede estar en muchos detalles de pedido.
    @OneToMany(() => DetallePedido, (detalle) => detalle.producto)
    detallesPedido: DetallePedido[];
    @OneToMany(() => HistorialPrecio, (historial) => historial.producto)
    historialPrecios: HistorialPrecio[];
}