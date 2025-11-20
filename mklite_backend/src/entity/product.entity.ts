// src/entity/product.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { OrderItem } from "./order-item.entity";
import { PriceHistory } from "./price-history.entity";
import { SupplierReturn } from "./supplier-return.entity"; // <--- IMPORTAR

@Entity('products') // <-- 'producto' -> 'products'
export class Product { // <-- 'Producto' -> 'Product'

    @PrimaryGeneratedColumn({ name: 'product_id' }) // <-- 'producto_id'
    id: number;

    @Column()
    name: string; // <-- 'nombre' -> 'name'

    @Column({ type: 'text', nullable: true })
    description: string; // <-- 'descripcion' -> 'description'

    @Column({ type: 'numeric', name: 'sale_price' })
    salePrice: number; // <-- 'precioVenta' -> 'salePrice'

    @Column({ name: 'unit_of_measure', default: 'Unit' }) // <-- 'unidad_medida' -> 'unit_of_measure'
    unitOfMeasure: string;

    @Column({ type: 'integer', name: 'physical_stock' })
    physicalStock: number; // <-- 'stockFisico' -> 'physicalStock'

    @Column({ type: 'integer', name: 'reserved_stock', default: 0 })
    reservedStock: number; // <-- 'stockReservado' -> 'reservedStock'

    @Column({ name: 'image_url', type: 'varchar', length: 512, nullable: true })
    imageUrl: string; // <-- 'urlImagen' -> 'imageUrl'

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    // --- Relationships ---
    @ManyToOne(() => Category, (category) => category.products) // <-- 'Categoria' -> 'Category'
    @JoinColumn({ name: 'category_id' }) // <-- 'categoria_id'
    category: Category; // <-- 'categoria' -> 'category'

    @OneToMany(() => OrderItem, (item) => item.product) // <-- 'DetallePedido' -> 'OrderItem'
    orderItems: OrderItem[]; // <-- 'detallesPedido' -> 'orderItems'
    
    @OneToMany(() => PriceHistory, (history) => history.product)
    priceHistory: PriceHistory[];
    @OneToMany(() => SupplierReturn, (supplierReturn) => supplierReturn.product)
    supplierReturns: SupplierReturn[];
}