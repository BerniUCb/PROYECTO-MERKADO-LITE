// src/entity/category.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./product.entity"; 

@Entity('categories') 
export class Category { 

    @PrimaryGeneratedColumn({ name: 'category_id' }) 
    id: number;

    @Column({ unique: true })
    name: string; 

    @Column({ nullable: true })
    description: string; 

    // --- Relationships ---
    // A Category has many Products
    @OneToMany(() => Product, (product) => product.category) // <-- La relación inversa será 'product.category'
    products: Product[]; // <-- 'productos' -> 'products'
}