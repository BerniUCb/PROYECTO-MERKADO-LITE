// src/entity/lot.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./product.entity"; 
import { Supplier } from "./supplier.entity"; 
import { StockMovement } from "./stock-movement.entity"; 
import { SupplierReturn } from "./supplier-return.entity"; 

@Entity('lots') 
export class Lot { 

    @PrimaryGeneratedColumn({ name: 'lot_id' }) 
    id: number;

    @Column({ type: 'integer', name: 'received_quantity' })
    receivedQuantity: number; 

    @Column({ type: 'integer', name: 'current_quantity' })
    currentQuantity: number; 

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'supplier_cost', nullable: true })
    supplierCost: number; 
    @Column({ type: 'date', name: 'received_at' })
    receivedAt: Date; 

    @Column({ type: 'date', name: 'expires_at', nullable: true })
    expiresAt: Date; 

    // --- Relationships ---
    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto'

    @ManyToOne(() => Supplier, (supplier) => supplier.lots, { nullable: true }) // <-- Relación inversa será 'supplier.lots'
    @JoinColumn({ name: 'supplier_id' }) // <-- 'proveedor_id'
    supplier: Supplier; // <-- 'proveedor' -> 'supplier'
    
    @OneToMany(() => StockMovement, (movement) => movement.lot) // <-- Relación inversa será 'movement.lot'
    stockMovements: StockMovement[]; // <-- 'movimientos' -> 'stockMovements'
    @OneToMany(() => SupplierReturn, (supplierReturn) => supplierReturn.lot)
    returns: SupplierReturn[];
}