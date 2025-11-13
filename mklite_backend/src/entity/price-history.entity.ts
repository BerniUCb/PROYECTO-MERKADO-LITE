// src/entity/price-history.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./product.entity";
import { User } from "./user.entity";

@Entity('historial_precio')
export class HistorialPrecio { // <-- ¡Corregido! Nombre de la clase en español.

    @PrimaryGeneratedColumn({ name: 'historial_precio_id' })
    id: number;

    @Column({ type: 'numeric', name: 'precio_nuevo', precision: 10, scale: 2 })
    precioNuevo: number;

    @CreateDateColumn({ name: 'fecha_cambio', type: 'timestamp with time zone' })
    fechaCambio: Date;

    // --- Relaciones ---

    @ManyToOne(() => Producto, (producto) => producto.historialPrecios, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'usuario_modifico_id' })
    usuarioModifico: User;
}