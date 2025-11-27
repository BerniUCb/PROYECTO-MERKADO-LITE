// --- File: src/entity/payment.entity.ts ---
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity";

export type PaymentMethod = 'cash' | 'qr' | 'card';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn({ name: 'payment_id' })
    id: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['cash', 'qr', 'card'], name: 'payment_method', default: 'cash' })
    method: PaymentMethod;

    @Column({ type: 'enum', enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
    status: PaymentStatus;

    
    @Column({ name: 'receipt_number', unique: true, nullable: true })
    receiptNumber: string;

    @Column({ name: 'receipt_url', nullable: true })
    receiptUrl: string; 

    @CreateDateColumn({ name: 'paid_at' })
    paidAt: Date;
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}