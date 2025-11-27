// src/entity/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { OrderItem } from "./order-item.entity";
import { PriceHistory } from "./price-history.entity";
import { SupplierReturn } from "./supplier-return.entity"; 
import { Promotion } from "./promotion.entity"; 

@Entity('products') 
export class Product { 
    @PrimaryGeneratedColumn({ name: 'product_id' }) 
    id: number;

    @Column()
    name: string; 

    @Column({ type: 'text', nullable: true })
    description: string; 
    @Column({ type: 'numeric', name: 'sale_price' })
    salePrice: number; 
    @Column({ name: 'unit_of_measure', default: 'Unit' })
    unitOfMeasure: string;

    @Column({ type: 'integer', name: 'physical_stock' })
    physicalStock: number; 

    @Column({ type: 'integer', name: 'reserved_stock', default: 0 })
    reservedStock: number; 

    @Column({ name: 'image_url', type: 'text', nullable: true })
    imageUrl: string; 

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;


    @ManyToOne(() => Category, (category) => category.products) 
    @JoinColumn({ name: 'category_id' }) 
    category: Category; 

    @OneToMany(() => OrderItem, (item) => item.product) 
    orderItems: OrderItem[]; 
    @OneToMany(() => PriceHistory, (history) => history.product)
    priceHistory: PriceHistory[];
    @OneToMany(() => SupplierReturn, (supplierReturn) => supplierReturn.product)
    supplierReturns: SupplierReturn[];
    @OneToMany(() => Promotion, (promotion) => promotion.product)
    promotions: Promotion[];
}