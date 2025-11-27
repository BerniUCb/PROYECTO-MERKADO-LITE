// src/entity/order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity"; 
import { Payment } from "./payment.entity"; 
// Define el enum para loos estados 
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn({ name: 'order_id' })
    id: number;

    @CreateDateColumn({ name: 'created_at' }) 
    createdAt: Date; 

    @Column({
        type: 'enum',
        enum: [
            'pending', 
            'processing', 
            'shipped', 
            'delivered', 
            'returned',
            'cancelled'
        ],
        default: 'pending'
    })
    status: OrderStatus; 

    @Column({ type: 'numeric', name: 'order_total' })
    orderTotal: number; 

    @Column({ name: 'payment_method' })
    paymentMethod: string; 


    @ManyToOne(() => User, (user) => user.orders) 
    @JoinColumn({ name: 'user_id' }) 
    user: User; 
    @OneToMany(() => OrderItem, (item) => item.order, {cascade:true}) 
    items: OrderItem[]; 
    @OneToOne(() => Payment, (payment) => payment.order) 
    payment: Payment;
}
