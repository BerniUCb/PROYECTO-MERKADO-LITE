// src/entity/support-ticket.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Order } from "./order.entity"; 
import { User } from "./user.entity";
import { SupportMessage } from "./support-message.entity"; 

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

@Entity('support_tickets') 
export class SupportTicket { 

    @PrimaryGeneratedColumn({ name: 'support_ticket_id' }) 
    id: number;

    @Column()
    subject: string; 

    @Column({
        type: 'enum',
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    })
    status: TicketStatus; 

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; 

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date; 

    @ManyToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) 
    order: Order; 

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' }) 
    user: User; 

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'agent_id' }) 
    agent: User; 
    
    @OneToMany(() => SupportMessage, (message) => message.ticket) 
    messages: SupportMessage[]; 
}