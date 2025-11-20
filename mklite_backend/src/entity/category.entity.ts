// src/entity/category.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./product.entity"; // <-- Anticipamos que 'Producto' se llamará 'Product'

@Entity('categories') // <-- 'categoria' -> 'categories'
export class Category { // <-- 'Categoria' -> 'Category'

    @PrimaryGeneratedColumn({ name: 'category_id' }) // <-- 'categoria_id'
    id: number;

    @Column({ unique: true })
    name: string; // <-- 'nombre' -> 'name'

    @Column({ nullable: true })
    description: string; // <-- 'descripcion' -> 'description'

    // --- Relationships ---
    // A Category has many Products
    @OneToMany(() => Product, (product) => product.category) // <-- La relación inversa será 'product.category'
    products: Product[]; // <-- 'productos' -> 'products'
}