// src/entity/order.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { DetallePedido } from "./order-item.entity"; // ¡Importante que esté importado!

@Entity('pedido')
export class Pedido {

    @PrimaryGeneratedColumn({ name: 'pedido_id' })
    id: number;

    @CreateDateColumn({ name: 'fecha_pedido' }) 
    fechaPedido: Date;

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

    @Column({ type: 'numeric', name: 'total_pedido' })
    totalPedido: number;

    @Column({ name: 'metodo_pago' })
    metodoPago: string;

    // --- Relaciones ---

    // Muchos Pedidos pertenecen a un Usuario (Cliente)
    @ManyToOne(() => User, (user) => user.pedidos)
    @JoinColumn({ name: 'cliente_id' })
    cliente: User;

    // --- ¡NUEVA RELACIÓN COMPLETA! ---
    
    // Un Pedido tiene muchos DetallePedido.
    // El primer argumento "() => DetallePedido" le dice a TypeORM qué entidad está al otro lado.
    // El segundo argumento "(detalle) => detalle.pedido" le dice a TypeORM:
    // "Dentro de la entidad DetallePedido, busca la propiedad 'pedido' para saber cómo conectar de vuelta".
    @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
    detalles: DetallePedido[];
}