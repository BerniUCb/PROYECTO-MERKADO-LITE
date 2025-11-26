// src/entity/shipment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity"; 
import { User } from "./user.entity";
import { Address } from "./address.entity"; 

export type ShipmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

@Entity('shipments') // <-- 'envio'
export class Shipment { // <-- 'Envio'

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
    status: ShipmentStatus; // <-- 'estado' 

    @Column({ name: 'assigned_at', type: 'timestamp with time zone', nullable: true })
    assignedAt: Date; // <-- 'fechaAsignacion' 

    @Column({ name: 'estimated_delivery_at', type: 'timestamp with time zone', nullable: true })
    estimatedDeliveryAt: Date; // <-- 'fechaEntregaEstimada'

    @Column({ name: 'delivered_at', type: 'timestamp with time zone', nullable: true })
    deliveredAt: Date; // <-- 'fechaEntregado'

    // --- Relationships ---
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) // <-- 'pedido_id'
    order: Order; // <-- 'pedido' -> 'order'

    @ManyToOne(() => User, (user) => user.assignedShipments, { nullable: true }) 
    @JoinColumn({ name: 'delivery_driver_id' }) 
    deliveryDriver: User; 
    
    @ManyToOne(() => Address, { nullable: false })
    @JoinColumn({ name: 'delivery_address_id' }) 
    deliveryAddress: Address; 
}