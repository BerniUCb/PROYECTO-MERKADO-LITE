// stock-movement.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./product.entity";
import { Lote } from "./lot.entity"; // <-- Import actualizado
import { User } from "./user.entity";

export type TipoMovimiento = 'entrada_compra' | 'salida_venta' | 'ajuste_vencido' | 'ajuste_devolucion';

@Entity('movimiento_stock')
export class MovimientoStock {

    @PrimaryGeneratedColumn({ name: 'movimiento_id' })
    id: number;

    @Column({ type: 'integer' })
    cantidad: number;

    @Column({
        type: 'enum',
        enum: [
            'entrada_compra',
            'salida_venta',
            'ajuste_vencido',
            'ajuste_devolucion'
        ],
        name: 'tipo'
    })
    tipo: TipoMovimiento;

    @CreateDateColumn({ name: 'fecha_movimiento', type: 'timestamp with time zone' })
    fechaMovimiento: Date;

    // --- Relaciones ---
    @ManyToOne(() => Producto, { nullable: false })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @ManyToOne(() => Lote, (lote) => lote.movimientos, { nullable: true })
    @JoinColumn({ name: 'lote_id' })
    lote: Lote;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;
}