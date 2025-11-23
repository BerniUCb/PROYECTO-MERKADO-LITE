import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Supplier } from "./supplier.entity"; // Asegúrate que el nombre del archivo coincida (provider o supplier)
import { Product } from "./product.entity";
import { Lot } from "./lot.entity";

export type ReturnReason = 'expired' | 'defective' | 'damaged_shipping';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

@Entity('supplier_returns')
export class SupplierReturn {
    @PrimaryGeneratedColumn({ name: 'return_id' })
    id: number;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({ type: 'enum', enum: ['expired', 'defective', 'damaged_shipping'], name: 'reason' })
    reason: ReturnReason;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected', 'refunded'], default: 'pending' })
    status: ReturnStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
    resolvedAt: Date;

    // Relaciones
    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Supplier, { nullable: false })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @ManyToOne(() => Lot, { nullable: true }) // Opcional, para saber de qué lote específico vino
    @JoinColumn({ name: 'lot_id' })
    lot: Lot;
}