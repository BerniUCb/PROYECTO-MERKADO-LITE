// src/entity/lot.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./product.entity"; // Anticipamos 'Product'
import { Supplier } from "./provider.entity"; // Anticipamos 'Supplier'
import { StockMovement } from "./stock-movement.entity"; // Anticipamos 'StockMovement'

@Entity('lots') // <-- 'lote' -> 'lots'
export class Lot { // <-- 'Lote' -> 'Lot'

    @PrimaryGeneratedColumn({ name: 'lot_id' }) // <-- 'lote_id'
    id: number;

    @Column({ type: 'integer', name: 'received_quantity' })
    receivedQuantity: number; // <-- 'cantidadRecibida' -> 'receivedQuantity'

    @Column({ type: 'integer', name: 'current_quantity' })
    currentQuantity: number; // <-- 'cantidadActual' -> 'currentQuantity'

    @Column({ type: 'numeric', precision: 10, scale: 2, name: 'supplier_cost', nullable: true })
    supplierCost: number; // <-- 'costoDistribuidor' -> 'supplierCost'

    @Column({ type: 'date', name: 'received_at' })
    receivedAt: Date; // <-- 'fechaRecibida' -> 'receivedAt'

    @Column({ type: 'date', name: 'expires_at', nullable: true })
    expiresAt: Date; // <-- 'fechaVencimiento' -> 'expiresAt'

    // --- Relationships ---
    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product; // <-- 'producto'

    @ManyToOne(() => Supplier, (supplier) => supplier.lots, { nullable: true }) // <-- Relación inversa será 'supplier.lots'
    @JoinColumn({ name: 'supplier_id' }) // <-- 'proveedor_id'
    supplier: Supplier; // <-- 'proveedor' -> 'supplier'
    
    @OneToMany(() => StockMovement, (movement) => movement.lot) // <-- Relación inversa será 'movement.lot'
    stockMovements: StockMovement[]; // <-- 'movimientos' -> 'stockMovements'
}