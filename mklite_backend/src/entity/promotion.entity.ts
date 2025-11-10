// promotion.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./product.entity";

@Entity('promocion')
export class Promocion {

    @PrimaryGeneratedColumn({ name: 'promocion_id' })
    id: number;

    @Column()
    descripcion: string;

    @Column({ name: 'tipo_descuento', nullable: true })
    tipoDescuento: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'valor_descuento', nullable: true })
    valorDescuento: number;

    @Column({ name: 'fecha_inicio', type: 'timestamp with time zone', nullable: true })
    fechaInicio: Date;

    @Column({ name: 'fecha_fin', type: 'timestamp with time zone', nullable: true })
    fechaFin: Date;

    // --- Relaciones ---
    @ManyToOne(() => Producto, { nullable: true })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;
}