import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('pedido')
export class Pedido {

    @PrimaryGeneratedColumn({ name: 'pedido_id' })
    id: number;

    // 'CreateDateColumn' se encarga automáticamente de la fecha de creación
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
    @JoinColumn({ name: 'cliente_id' }) // La llave foránea
    cliente: User;
}