// src/entity/order-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity"; 
import { Product } from "./product.entity"; 


@Entity('order_items') 
export class OrderItem { 

    @PrimaryGeneratedColumn({ name: 'order_item_id' }) 
    id: number;

    @Column({ type: 'integer' })
    quantity: number;
    @Column({ type: 'numeric', name: 'unit_price' })
    unitPrice: number; 
    @ManyToOne(() => Order, (order) => order.items, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order; 

    @ManyToOne(() => Product, (product) => product.orderItems, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product; 
    
}