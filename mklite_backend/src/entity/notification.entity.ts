// src/entity/notification.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

// Business-specific notification types
export type NotificationType = 
  | 'CASH_REGISTER_CLOSED'  // Cierre de caja
  | 'LOW_STOCK'             // Stock bajo
  | 'HIGH_DEMAND_PRODUCT'   // Demanda alta de producto
  | 'ORDER_RECEIVED'        // Pedido recibido
  | 'ORDER_SHIPPED'         // Pedido en camino
  | 'ORDER_DELIVERED'       // Pedido entregado
  | 'NEW_PROMOTION';        // Nueva promoción

// Recipient roles for easy filtering
export type RecipientRole = 'Admin' | 'Client';

@Entity('notifications') // <-- 'notificacion' -> 'notifications'
export class Notification { // <-- 'Notificacion' -> 'Notification'

    @PrimaryGeneratedColumn({ name: 'notification_id' }) // <-- 'notificacion_id'
    id: number;

    @Column()
    title: string; // <-- 'titulo' -> 'title'

    @Column({ type: 'text' })
    detail: string; // <-- 'detalle' -> 'detail'

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
    type: NotificationType; // <-- 'tipo' -> 'type'
    
    @Column({
        type: 'enum',
        enum: ['Admin', 'Client'], // <-- Traducido para consistencia
        name: 'recipient_role'
    })
    recipientRole: RecipientRole; // <-- 'destinatarioRol' -> 'recipientRole'

    @Column({ name: 'related_entity_id', nullable: true })
    relatedEntityId: string; // <-- 'entidadRelacionadaId' -> 'relatedEntityId'

    @Column({ name: 'is_read', default: false })
    isRead: boolean; // <-- 'leido' -> 'isRead'

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; // <-- 'fechaCreacion' -> 'createdAt'

    // --- Relationships ---
    @ManyToOne(() => User, (user) => user.notifications, { nullable: true }) // <-- 'usuario.notificaciones' -> 'user.notifications'
    @JoinColumn({ name: 'user_id' })
    user: User; // <-- 'usuario' -> 'user'
}