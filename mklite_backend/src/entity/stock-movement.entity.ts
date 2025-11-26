// src/entity/stock-movement.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; 
import { Lot } from "./lot.entity"; 
import { User } from "./user.entity";

export type MovementType = 'purchase_entry' | 'sale_exit' | 'expired_adjustment' | 'return_adjustment';

@Entity('stock_movements') 
export class StockMovement { 

    @PrimaryGeneratedColumn({ name: 'movement_id' }) 
    id: number;

    @Column({ type: 'integer' })
    quantity: number; 

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
    type: MovementType; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; 

    // --- Relationships ---
    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product; 

    @ManyToOne(() => Lot, (lot) => lot.stockMovements, { nullable: true }) // <-- Relación inversa será 'lot.stockMovements'
    @JoinColumn({ name: 'lot_id' })
    lot: Lot; 

    @ManyToOne(() => User, (user) => user.stockMovements, { nullable: true }) // <-- Relación inversa será 'user.stockMovements'
    @JoinColumn({ name: 'user_id' })
    user: User; 
}