// src/entity/notification.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";


export type NotificationType = 
  | 'CASH_REGISTER_CLOSED'  // Cierre de caja
  | 'LOW_STOCK'             // Stock bajo
  | 'HIGH_DEMAND_PRODUCT'   // Demanda alta de producto
  | 'ORDER_RECEIVED'        // Pedido recibido
  | 'ORDER_SHIPPED'         // Pedido en camino
  | 'ORDER_DELIVERED'       // Pedido entregado
  | 'NEW_PROMOTION';        // Nueva promoción


export type RecipientRole = 'Admin' | 'Client' | 'DeliveryDriver'; 

@Entity('notifications') 
export class Notification { 

    @PrimaryGeneratedColumn({ name: 'notification_id' })
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    detail: string;

    @Column({
        type: 'enum',
        enum: [
            'CASH_REGISTER_CLOSED',
            'LOW_STOCK',
            'HIGH_DEMAND_PRODUCT',
            'ORDER_RECEIVED',
            'ORDER_SHIPPED',
            'ORDER_DELIVERED',
            'NEW_PROMOTION'
        ]
    })
    type: NotificationType; 
    
    @Column({
        type: 'enum',
        enum: ['Admin', 'Client', 'DeliveryDriver'],
        name: 'recipient_role'
    })
    recipientRole: RecipientRole; 
    @Column({ name: 'related_entity_id', nullable: true })
    relatedEntityId: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean; 

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;


    @ManyToOne(() => User, (user) => user.notifications, { nullable: true }) 
    @JoinColumn({ name: 'user_id' })
    user: User; 
}