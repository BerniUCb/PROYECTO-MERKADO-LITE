// cart-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Producto } from "./product.entity";

@Entity('carrito_item')
@Unique(['cliente', 'producto'])
export class CarritoItem {

    @PrimaryGeneratedColumn({ name: 'carrito_item_id' })
    id: number;

    @Column({ type: 'integer', default: 1 })
    cantidad: number;
        // --- ¡NUEVA PROPIEDAD AÑADIDA! ---
     @Column({ type: 'numeric', name: 'precio_unitario', nullable: false }) // 'nullable: false' para que siempre se guarde un precio.
    precioUnitario: number;

    @CreateDateColumn({ name: 'fecha_agregado', type: 'timestamp with time zone' })
    fechaAgregado: Date;
    
    // --- Relaciones ---
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'cliente_id' })
    cliente: User;

    @ManyToOne(() => Producto, { nullable: false })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;
}