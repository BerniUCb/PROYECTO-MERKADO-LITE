// src/entity/price-history.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; 
import { User } from "./user.entity";

@Entity('price_history') 
export class PriceHistory {

    @PrimaryGeneratedColumn({ name: 'price_history_id' }) 
    id: number;

    @Column({ type: 'numeric', name: 'new_price', precision: 10, scale: 2 })
    newPrice: number; 

    @CreateDateColumn({ name: 'changed_at', type: 'timestamp with time zone' })
    changedAt: Date; 

    @ManyToOne(() => Product, (product) => product.priceHistory, { nullable: false, onDelete: 'CASCADE' }) 
    @ManyToOne(() => Product, (product) => product.priceHistory, { nullable: false, onDelete: 'CASCADE' }) // <-- Relación inversa será 'product.priceHistory'
    @JoinColumn({ name: 'product_id' })
    product: Product; 

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'changed_by_user_id' }) 
    changedByUser: User; 
}