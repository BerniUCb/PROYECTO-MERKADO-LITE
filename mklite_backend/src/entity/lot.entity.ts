// lot.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Producto } from "./product.entity";
import { Proveedor } from "./provider.entity"; // <-- Import actualizado
import { MovimientoStock } from "./stock-movement.entity"; // <-- Import actualizado

@Entity('lote')
export class Lote {

    @PrimaryGeneratedColumn({ name: 'lote_id' })
    id: number;

    @Column({ type: 'integer', name: 'cantidad_recibida' })
    cantidadRecibida: number;

    @Column({ type: 'integer', name: 'cantidad_actual' })
    cantidadActual: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'costo_distribuidor', nullable: true })
    costoDistribuidor: number;

    @Column({ type: 'date', name: 'fecha_recibida' })
    fechaRecibida: Date;

    @Column({ type: 'date', name: 'fecha_vencimiento', nullable: true })
    fechaVencimiento: Date;

    // --- Relaciones ---
    @ManyToOne(() => Producto, { nullable: false })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;

    @ManyToOne(() => Proveedor, (proveedor) => proveedor.lotes, { nullable: true })
    @JoinColumn({ name: 'proveedor_id' })
    proveedor: Proveedor;
    
    @OneToMany(() => MovimientoStock, (movimiento) => movimiento.lote)
    movimientos: MovimientoStock[];
}