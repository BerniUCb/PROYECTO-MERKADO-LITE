// src/entity/support-message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { SupportTicket } from "./support-ticket.entity"; // Anticipamos 'SupportTicket'
import { User } from "./user.entity";

@Entity('support_messages') // <-- 'mensaje_soporte' -> 'support_messages'
export class SupportMessage { // <-- 'MensajeSoporte' -> 'SupportMessage'

    @PrimaryGeneratedColumn({ name: 'support_message_id' }) // <-- 'mensaje_soporte_id'
    id: number;

    @Column({ type: 'text' })
    content: string; // <-- 'contenido' -> 'content'

    @CreateDateColumn({ name: 'sent_at' })
    sentAt: Date; // <-- 'fechaEnvio' -> 'sentAt'
    
    // --- Relationships ---
    @ManyToOne(() => SupportTicket, (ticket) => ticket.messages, { nullable: false }) // <-- Relación inversa será 'ticket.messages'
    @JoinColumn({ name: 'support_ticket_id' }) // <-- 'ticket_soporte_id'
    ticket: SupportTicket; // <-- 'ticket' -> 'ticket' (apunta a 'SupportTicket')
    
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'sender_id' }) // <-- 'remitente_id' -> 'sender_id'
    sender: User; // <-- 'remitente' -> 'sender'
}