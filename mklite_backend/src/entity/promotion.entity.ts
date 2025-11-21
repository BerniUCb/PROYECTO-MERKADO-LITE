// src/entity/promotion.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity"; // <-- Actualizado a 'Product'

@Entity('promotions') // <-- 'promocion' -> 'promotions'
export class Promotion { // <-- 'Promocion' -> 'Promotion'

    @PrimaryGeneratedColumn({ name: 'promotion_id' }) // <-- 'promocion_id'
    id: number;

    @Column()
    description: string; // <-- 'descripcion' -> 'description'

    @Column({ name: 'discount_type', nullable: true })
    discountType: string; // <-- 'tipoDescuento' -> 'discountType'

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'discount_value', nullable: true })
    discountValue: number; // <-- 'valorDescuento' -> 'discountValue'

    @Column({ name: 'starts_at', type: 'timestamp with time zone', nullable: true })
    startsAt: Date; // <-- 'fechaInicio' -> 'startsAt'

    @Column({ name: 'ends_at', type: 'timestamp with time zone', nullable: true })
    endsAt: Date; // <-- 'fechaFin' -> 'endsAt'

    // --- Relationships ---
    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto' -> 'product' y apunta a la clase 'Product'
}