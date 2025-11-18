// src/entity/order-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity"; // Anticipamos 'Order'
import { Product } from "./product.entity"; // Anticipamos 'Product'

@Entity('order_items') // <-- 'detalle_pedido' -> 'order_items'
export class OrderItem { // <-- 'DetallePedido' -> 'OrderItem'

    @PrimaryGeneratedColumn({ name: 'order_item_id' }) // <-- 'detalle_pedido_id'
    id: number;

    @Column({ type: 'integer' })
    quantity: number; // <-- 'cantidad' -> 'quantity'

    @Column({ type: 'numeric', name: 'unit_price' })
    unitPrice: number; // <-- 'precioUnitario' -> 'unitPrice'

    // --- Relationships ---
    @ManyToOne(() => Order, (order) => order.items, { nullable: false }) // <-- Relación inversa será 'order.items'
    @JoinColumn({ name: 'order_id' }) // <-- 'pedido_id'
    order: Order; // <-- 'pedido' -> 'order'

    @ManyToOne(() => Product, (product) => product.orderItems, { nullable: false }) // <-- Relación inversa será 'product.orderItems'
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto' -> 'product'
}