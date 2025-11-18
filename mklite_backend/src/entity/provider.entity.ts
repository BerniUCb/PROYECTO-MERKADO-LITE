// src/entity/provider.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Lot } from "./lot.entity"; // <-- Actualizado de 'Lote' a 'Lot'

@Entity('suppliers') // <-- 'proveedor' -> 'suppliers'
export class Supplier { // <-- 'Proveedor' -> 'Supplier'

    @PrimaryGeneratedColumn({ name: 'supplier_id' }) // <-- 'proveedor_id'
    id: number;

    @Column({ name: 'company_name' })
    companyName: string; // <-- 'nombreEmpresa' -> 'companyName'

    @Column({ name: 'contact_name', nullable: true })
    contactName: string; // <-- 'contactoNombre' -> 'contactName'

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string; // <-- 'telefono' -> 'phone'

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; // <-- 'fechaCreacion' -> 'createdAt'

    // --- Relationships ---
    @OneToMany(() => Lot, (lot) => lot.supplier) // <-- 'Lote' -> 'Lot', '(lote) => lote.proveedor' -> '(lot) => lot.supplier'
    lots: Lot[]; // <-- 'lotes' -> 'lots'
}