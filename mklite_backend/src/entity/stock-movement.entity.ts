// src/entity/stock-movement.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; // <-- Actualizado
import { Lot } from "./lot.entity"; // <-- Actualizado
import { User } from "./user.entity";

export type MovementType = 'purchase_entry' | 'sale_exit' | 'expired_adjustment' | 'return_adjustment';

@Entity('stock_movements') // <-- 'movimiento_stock' -> 'stock_movements'
export class StockMovement { // <-- 'MovimientoStock' -> 'StockMovement'

    @PrimaryGeneratedColumn({ name: 'movement_id' }) // <-- 'movimiento_id'
    id: number;

    @Column({ type: 'integer' })
    quantity: number; // <-- 'cantidad' -> 'quantity'

    @Column({
        type: 'enum',
        enum: [
            'purchase_entry',
            'sale_exit',
            'expired_adjustment',
            'return_adjustment'
        ],
        name: 'type'
    })
    type: MovementType; // <-- 'tipo' -> 'type'

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; // <-- 'fechaMovimiento' -> 'createdAt'

    // --- Relationships ---
    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto'

    @ManyToOne(() => Lot, (lot) => lot.stockMovements, { nullable: true }) // <-- Relación inversa será 'lot.stockMovements'
    @JoinColumn({ name: 'lot_id' })
    lot: Lot; // <-- 'lote'

    @ManyToOne(() => User, (user) => user.stockMovements, { nullable: true }) // <-- Relación inversa será 'user.stockMovements'
    @JoinColumn({ name: 'user_id' })
    user: User; // <-- 'usuario' -> 'user'
}