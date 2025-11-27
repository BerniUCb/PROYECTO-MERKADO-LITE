// src/entity/shipment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Order } from "./order.entity"; 
import { User } from "./user.entity";
import { Address } from "./address.entity"; 

export type ShipmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

@Entity('shipments') 
export class Shipment { 

    @PrimaryGeneratedColumn({ name: 'shipment_id' }) 
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
    status: ShipmentStatus; 

    @Column({ name: 'assigned_at', type: 'timestamp with time zone', nullable: true })
    assignedAt: Date; 

    @Column({ name: 'estimated_delivery_at', type: 'timestamp with time zone', nullable: true })
    estimatedDeliveryAt: Date; 

    @Column({ name: 'delivered_at', type: 'timestamp with time zone', nullable: true })
    deliveredAt: Date; 

    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) 
    order: Order; 

    @ManyToOne(() => User, (user) => user.assignedShipments, { nullable: true }) 
    @JoinColumn({ name: 'delivery_driver_id' }) 
    deliveryDriver: User; 
    
    @ManyToOne(() => Address, { nullable: false })
    @JoinColumn({ name: 'delivery_address_id' }) 
    deliveryAddress: Address; 
}