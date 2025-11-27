// src/entity/cart-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity"; 
@Entity('cart_items') 
@Unique(['user', 'product']) 
export class CartItem { 

    @PrimaryGeneratedColumn({ name: 'cart_item_id' }) 
    id: number;

    @Column({ type: 'integer', default: 1 })
    quantity: number;

    @Column({ type: 'numeric', name: 'unit_price', nullable: false })
    unitPrice: number;

    @CreateDateColumn({ name: 'added_at', type: 'timestamp with time zone' })
    addedAt: Date; 
    

    @ManyToOne(() => User, (user) => user.cartItems, { nullable: false }) 
    @JoinColumn({ name: 'user_id' }) 
    user: User; 

    @ManyToOne(() => Product, { nullable: false }) 
    @JoinColumn({ name: 'product_id' })
    product: Product; 
}