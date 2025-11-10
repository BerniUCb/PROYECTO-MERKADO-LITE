import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./category.entity";

@Entity('producto')
export class Producto {

    @PrimaryGeneratedColumn({ name: 'producto_id' })
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'numeric', name: 'precio_venta' })
    precioVenta: number;

    @Column({ name: 'unidad_medida' })
    unidadMedida: string;

    @Column({ type: 'integer', name: 'stock_disponible' })
    stockDisponible: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    // --- Relaciones ---
    // Muchos Productos pertenecen a una Categoria
    @ManyToOne(() => Categoria, (categoria) => categoria.productos)
    @JoinColumn({ name: 'categoria_id' }) // Esta es la llave foránea
    categoria: Categoria;
}