// rating.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, Check } from "typeorm";
import { Pedido } from "./order.entity";
import { User } from "./user.entity";

@Entity('calificacion')
@Check(`"puntuacion" >= 1 AND "puntuacion" <= 5`)
export class Calificacion {

    @PrimaryGeneratedColumn({ name: 'calificacion_id' })
    id: number;
    
    @Column({ type: 'integer' })
    puntuacion: number;

    @Column({ type: 'text', nullable: true })
    comentario: string;

    @CreateDateColumn({ name: 'fecha_calificacion', type: 'timestamp with time zone' })
    fechaCalificacion: Date;

    // --- Relaciones ---
    @OneToOne(() => Pedido, { nullable: false })
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'cliente_id' })
    cliente: User;
}