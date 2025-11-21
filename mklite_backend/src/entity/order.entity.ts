// src/entity/order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order-item.entity"; // <-- Actualizado de 'DetallePedido' a 'OrderItem'
import { Payment } from "./payment.entity"; // <--- IMPORTAR

// Define el enum para los estados del pedido en inglés
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

@Entity('orders') // <-- 'pedido' -> 'orders'
export class Order { // <-- 'Pedido' -> 'Order'

    @PrimaryGeneratedColumn({ name: 'order_id' }) // <-- 'pedido_id'
    id: number;

    @CreateDateColumn({ name: 'created_at' }) 
    createdAt: Date; // <-- 'fechaPedido' -> 'createdAt'

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
    status: OrderStatus; // <-- 'estado' -> 'status'

    @Column({ type: 'numeric', name: 'order_total' })
    orderTotal: number; // <-- 'totalPedido' -> 'orderTotal'

    @Column({ name: 'payment_method' })
    paymentMethod: string; // <-- 'metodoPago' -> 'paymentMethod'

    // --- Relationships ---
    @ManyToOne(() => User, (user) => user.orders) // <-- Relación inversa será 'user.orders'
    @JoinColumn({ name: 'user_id' }) // <-- 'cliente_id' -> 'user_id'
    user: User; // <-- 'cliente' -> 'user'

    @OneToMany(() => OrderItem, (item) => item.order) // <-- 'DetallePedido' -> 'OrderItem', '(detalle) => detalle.pedido' -> '(item) => item.order'
    items: OrderItem[]; // <-- 'detalles' -> 'items'
    @OneToOne(() => Payment, (payment) => payment.order) // Relación inversa
    payment: Payment;
}