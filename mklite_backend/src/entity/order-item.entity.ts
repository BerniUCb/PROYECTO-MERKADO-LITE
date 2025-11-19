// src/entity/order-item.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Pedido } from "./order.entity";
import { Producto } from "./product.entity";

@Entity('detalle_pedido')
export class DetallePedido {

    @PrimaryGeneratedColumn({ name: 'detalle_pedido_id' })
    id: number;

    @Column({ type: 'integer' })
    cantidad: number;

    @Column({ type: 'numeric', name: 'precio_unitario' })
    precioUnitario: number; // Guardamos el precio al momento de la compra

    // --- Relaciones ---

    // Muchos "detalles" pertenecen a un solo Pedido
    @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { nullable: false })
    @JoinColumn({ name: 'pedido_id' })
    pedido: Pedido;

    // Muchos "detalles" (de diferentes pedidos) pueden referirse al mismo Producto
    @ManyToOne(() => Producto, (producto) => producto.detallesPedido, { nullable: false })
    @JoinColumn({ name: 'producto_id' })
    producto: Producto;
}