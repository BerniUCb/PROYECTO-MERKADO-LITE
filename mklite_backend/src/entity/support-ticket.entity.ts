import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Pedido } from "./order.entity";
import { User } from "./user.entity";
import { MensajeSoporte } from "./support-message.entity"; // <-- Importamos la clase con el nombre correcto

export type EstadoTicket = 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';

@Entity('ticket_soporte')
export class TicketSoporte {

    @PrimaryGeneratedColumn({ name: 'ticket_soporte_id' })
    id: number;

    @Column()
    asunto: string;

    @Column({
        type: 'enum',
        enum: ['abierto', 'en_proceso', 'resuelto', 'cerrado'],
        default: 'abierto'
    })
    estado: EstadoTicket;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    @UpdateDateColumn({ name: 'fecha_actualizacion' })
    fechaActualizacion: Date;

    // --- Relaciones ---
    @ManyToOne(() => Pedido, { nullable: false })
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @ManyToOne(() => User, { nullable: false }) // El cliente que abrió el ticket
    @JoinColumn({ name: 'cliente_id' })
    cliente: User;

    @ManyToOne(() => User, { nullable: true }) // El agente de soporte asignado
    @JoinColumn({ name: 'agente_id' })
    agente: User;
    
    @OneToMany(() => MensajeSoporte, (mensaje) => mensaje.ticket)
    mensajes: MensajeSoporte[];
}