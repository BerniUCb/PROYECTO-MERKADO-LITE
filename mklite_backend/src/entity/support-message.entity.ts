import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { TicketSoporte } from "./support-ticket.entity";
import { User } from "./user.entity";

@Entity('mensaje_soporte')
export class MensajeSoporte {

    @PrimaryGeneratedColumn({ name: 'mensaje_soporte_id' })
    id: number;

    @Column({ type: 'text' })
    contenido: string;

    @CreateDateColumn({ name: 'fecha_envio' })
    fechaEnvio: Date;
    
    // --- Relaciones ---
    @ManyToOne(() => TicketSoporte, (ticket) => ticket.mensajes, { nullable: false })
    @JoinColumn({ name: 'ticket_soporte_id' })
    ticket: TicketSoporte;
    
    @ManyToOne(() => User, { nullable: false }) // Quién envió el mensaje (cliente o agente)
    @JoinColumn({ name: 'remitente_id' })
    remitente: User;
}