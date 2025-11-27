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
    
    @ManyToOne(() => SupportTicket, (ticket) => ticket.messages, { nullable: false }) 
    @JoinColumn({ name: 'support_ticket_id' }) 
    ticket: SupportTicket; 
    
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'sender_id' }) 
    sender: User; 
}