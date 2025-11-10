// shipment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Pedido } from "./order.entity";
import { User } from "./user.entity";

@Entity('envio')
export class Envio {

    @PrimaryGeneratedColumn({ name: 'envio_id' })
    id: number;

    @Column({
        type: 'enum',
        enum: [
            'pendiente', 
            'procesando', 
            'en camino', 
            'entregado', 
            'devuelto',
            'cancelado'
        ],
        default: 'pendiente'
    })
    estado: string;

    @Column({ name: 'fecha_asignacion', type: 'timestamp with time zone', nullable: true })
    fechaAsignacion: Date;

    @Column({ name: 'fecha_entrega_estimada', type: 'timestamp with time zone', nullable: true })
    fechaEntregaEstimada: Date;

    @Column({ name: 'fecha_entregado', type: 'timestamp with time zone', nullable: true })
    fechaEntregado: Date;

    // --- Relaciones ---
    @OneToOne(() => Pedido, { nullable: false })
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'repartidor_id' })
    repartidor: User;
}