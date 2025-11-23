// src/entity/shipment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity"; // <-- Actualizado
import { User } from "./user.entity";
import { Address } from "./address.entity"; // <-- Actualizado

export type ShipmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

@Entity('shipments') // <-- 'envio' -> 'shipments'
export class Shipment { // <-- 'Envio' -> 'Shipment'

    @PrimaryGeneratedColumn({ name: 'shipment_id' }) // <-- 'envio_id'
    id: number;

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
    status: ShipmentStatus; // <-- 'estado' -> 'status'

    @Column({ name: 'assigned_at', type: 'timestamp with time zone', nullable: true })
    assignedAt: Date; // <-- 'fechaAsignacion' -> 'assignedAt'

    @Column({ name: 'estimated_delivery_at', type: 'timestamp with time zone', nullable: true })
    estimatedDeliveryAt: Date; // <-- 'fechaEntregaEstimada' -> 'estimatedDeliveryAt'

    @Column({ name: 'delivered_at', type: 'timestamp with time zone', nullable: true })
    deliveredAt: Date; // <-- 'fechaEntregado' -> 'deliveredAt'

    // --- Relationships ---
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) // <-- 'pedido_id'
    order: Order; // <-- 'pedido' -> 'order'

    @ManyToOne(() => User, (user) => user.assignedShipments, { nullable: true }) // <-- Relación inversa será 'user.assignedShipments'
    @JoinColumn({ name: 'delivery_driver_id' }) // <-- 'repartidor_id' -> 'delivery_driver_id'
    deliveryDriver: User; // <-- 'repartidor' -> 'deliveryDriver'
    
    @ManyToOne(() => Address, { nullable: false })
    @JoinColumn({ name: 'delivery_address_id' }) // <-- 'direccion_entrega_id' -> 'delivery_address_id'
    deliveryAddress: Address; // <-- 'direccionEntrega' -> 'deliveryAddress'
}