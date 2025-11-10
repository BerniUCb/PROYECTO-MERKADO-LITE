// provider.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Lote } from "./lot.entity"; // <-- Import actualizado

@Entity('proveedor')
export class Proveedor {

    @PrimaryGeneratedColumn({ name: 'proveedor_id' })
    id: number;

    @Column({ name: 'nombre_empresa' })
    nombreEmpresa: string;

    @Column({ name: 'contacto_nombre', nullable: true })
    contactoNombre: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    telefono: string;

    @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp with time zone' })
    fechaCreacion: Date;

    // --- Relaciones ---
    @OneToMany(() => Lote, (lote) => lote.proveedor)
    lotes: Lote[];
}