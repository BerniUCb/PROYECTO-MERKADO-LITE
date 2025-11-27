// src/entity/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { OrderItem } from "./order-item.entity";
import { PriceHistory } from "./price-history.entity";
import { SupplierReturn } from "./supplier-return.entity"; 
import { Promotion } from "./promotion.entity"; 

@Entity('products') // <-- 'producto' 
export class Product { // <-- 'Producto'

    @PrimaryGeneratedColumn({ name: 'product_id' }) // <-- 'producto_id'
    id: number;

    @Column()
    name: string; // <-- 'nombre'

    @Column({ type: 'text', nullable: true })
    description: string; // <-- 'descripcion' 

    @Column({ type: 'numeric', name: 'sale_price' })
    salePrice: number; // <-- 'precioVenta' 

    @Column({ name: 'unit_of_measure', default: 'Unit' }) // <-- 'unidad_medida' 
    unitOfMeasure: string;

    @Column({ type: 'integer', name: 'physical_stock' })
    physicalStock: number; // <-- 'stockFisico' 

    @Column({ type: 'integer', name: 'reserved_stock', default: 0 })
    reservedStock: number; // <-- 'stockReservado' 

    @Column({ name: 'image_url', type: 'text', nullable: true })
    imageUrl: string; 

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;

    // --- Relationships ---
    @ManyToOne(() => Category, (category) => category.products) // <-- 'Categori
    @JoinColumn({ name: 'category_id' }) // <-- 'categoria_id'
    category: Category; // <-- 'categoria' -> 'category'

    @OneToMany(() => OrderItem, (item) => item.product) // <-- 'DetallePedido' -> 'OrderItem'
    orderItems: OrderItem[]; // <-- 'detallesPedido' -> 'orderItems'
    
    @OneToMany(() => PriceHistory, (history) => history.product)
    priceHistory: PriceHistory[];
    @OneToMany(() => SupplierReturn, (supplierReturn) => supplierReturn.product)
    supplierReturns: SupplierReturn[];
    @OneToMany(() => Promotion, (promotion) => promotion.product)
    promotions: Promotion[];
}