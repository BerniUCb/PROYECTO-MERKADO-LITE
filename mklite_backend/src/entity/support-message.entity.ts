// src/entity/support-message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SupportTicket } from "./support-ticket.entity"; 
import { User } from "./user.entity";

@Entity('support_messages') 
export class SupportMessage { 

    @PrimaryGeneratedColumn({ name: 'support_message_id' }) 
    id: number;

    @Column({ type: 'text' })
    content: string; 

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date; 
    
    // --- Relationships ---
    @ManyToOne(() => SupportTicket, (ticket) => ticket.messages, { nullable: false }) // <-- Relación inversa será 'ticket.messages'
    @JoinColumn({ name: 'support_ticket_id' }) // <-- 'ticket_soporte_id'
    ticket: SupportTicket; // <-- 'ticket' -> 'ticket' (apunta a 'SupportTicket')
    
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'sender_id' }) // <-- 'remitente_id' -> 'sender_id'
    sender: User; // <-- 'remitente' -> 'sender'
}