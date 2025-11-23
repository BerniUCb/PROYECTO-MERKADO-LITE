// src/entity/cart-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity"; // <-- Anticipamos que 'Producto' se llamará 'Product'

@Entity('cart_items') // <-- 'carrito_item' -> 'cart_items'
@Unique(['user', 'product']) // <-- Propiedades en inglés
export class CartItem { // <-- 'CarritoItem' -> 'CartItem'

    @PrimaryGeneratedColumn({ name: 'cart_item_id' }) // <-- 'carrito_item_id'
    id: number;

    @Column({ type: 'integer', default: 1 })
    quantity: number; // <-- 'cantidad' -> 'quantity'

    @Column({ type: 'numeric', name: 'unit_price', nullable: false })
    unitPrice: number; // <-- 'precioUnitario' -> 'unitPrice'

    @CreateDateColumn({ name: 'added_at', type: 'timestamp with time zone' })
    addedAt: Date; // <-- 'fechaAgregado' -> 'addedAt'
    
    // --- Relationships ---
    @ManyToOne(() => User, (user) => user.cartItems, { nullable: false }) // <-- Relación con 'user.cartItems'
    @JoinColumn({ name: 'user_id' }) // <-- 'cliente_id' -> 'user_id'
    user: User; // <-- 'cliente' -> 'user'

    @ManyToOne(() => Product, { nullable: false }) // <-- Apunta a la futura clase 'Product'
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto' -> 'product'
}