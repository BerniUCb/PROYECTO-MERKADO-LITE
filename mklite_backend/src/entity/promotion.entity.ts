// src/entity/promotion.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; // 

@Entity('promotions')
export class Promotion { 
    @PrimaryGeneratedColumn({ name: 'promotion_id' }) 
    id: number;

    @Column()
    description: string; 

    @Column({ name: 'discount_type', nullable: true })
    discountType: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'discount_value', nullable: true })
    discountValue: number; 

    @Column({ name: 'starts_at', type: 'timestamp with time zone', nullable: true })
    startsAt: Date; 

    @Column({ name: 'ends_at', type: 'timestamp with time zone', nullable: true })
    endsAt: Date; 
    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product; 
}