// src/entity/price-history.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; // Anticipamos 'Product'
import { User } from "./user.entity";

@Entity('price_history') // <-- 'historial_precio' -> 'price_history'
export class PriceHistory { // <-- 'HistorialPrecio' -> 'PriceHistory'

    @PrimaryGeneratedColumn({ name: 'price_history_id' }) // <-- 'historial_precio_id'
    id: number;

    @Column({ type: 'numeric', name: 'new_price', precision: 10, scale: 2 })
    newPrice: number; // <-- 'precioNuevo' -> 'newPrice'

    @CreateDateColumn({ name: 'changed_at', type: 'timestamp with time zone' })
    changedAt: Date; // <-- 'fechaCambio' -> 'changedAt'

    // --- Relationships ---
    @ManyToOne(() => Product, (product) => product.priceHistory, { nullable: false, onDelete: 'CASCADE' }) // <-- Relación inversa será 'product.priceHistory'
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto'

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'changed_by_user_id' }) // <-- 'usuario_modifico_id' -> 'changed_by_user_id'
    changedByUser: User; // <-- 'usuarioModifico' -> 'changedByUser'
}