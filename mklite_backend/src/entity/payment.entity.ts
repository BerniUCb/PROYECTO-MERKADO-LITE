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

    // Para el comprobante (HU6)
    @Column({ name: 'receipt_number', unique: true, nullable: true })
    receiptNumber: string; // Ej: REC-000123

    @Column({ name: 'receipt_url', nullable: true })
    receiptUrl: string; // URL del PDF si lo subes a la nube (S3/Cloudinary) o ruta local

    @CreateDateColumn({ name: 'paid_at' })
    paidAt: Date;

    // Relación 1 a 1: Un pedido tiene un pago (en este modelo Lite)
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;
}