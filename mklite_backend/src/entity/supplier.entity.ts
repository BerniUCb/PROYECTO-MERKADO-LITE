// src/entity/provider.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Lot } from "./lot.entity"; 
import { SupplierReturn } from "./supplier-return.entity"; 

@Entity('suppliers') 
export class Supplier { 

    @PrimaryGeneratedColumn({ name: 'supplier_id' })
    id: number;

    @Column({ name: 'company_name' })
    companyName: string; 

    @Column({ name: 'contact_name', nullable: true })
    contactName: string; 

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; 

    
    @OneToMany(() => Lot, (lot) => lot.supplier) 
    lots: Lot[]; 
    @OneToMany(() => SupplierReturn, (supplierReturn) => supplierReturn.supplier)
    returns: SupplierReturn[];
}