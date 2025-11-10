import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Producto } from "./product.entity";

@Entity('categoria')
export class Categoria {

    @PrimaryGeneratedColumn({ name: 'categoria_id' })
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column({ nullable: true }) // 'descripcion' puede ser opcional
    descripcion: string;

    // --- Relaciones ---
    // Una Categoria tiene muchos Productos
    @OneToMany(() => Producto, (producto) => producto.categoria)
    productos: Producto[];
}