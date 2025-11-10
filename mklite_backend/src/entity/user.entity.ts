// user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pedido } from "./order.entity";
import { Envio } from "./shipment.entity";
import { CarritoItem } from "./cart-item.entity";
import { Calificacion } from "./rating.entity";
import { MovimientoStock } from "./stock-movement.entity";

// Definimos el tipo para que sea más fácil de usar
export type RolUsuario = 'Administrador' | 'Vendedor' | 'Almacen' | 'Repartidor' | 'Cliente' | 'Soporte' | 'Proveedor';

@Entity('usuario') 
export class User {

    @PrimaryGeneratedColumn({ name: 'usuario_id' })
    id: number;

    @Column({ name: 'nombre_completo' })
    nombreCompleto: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: [ 
            'Administrador', 
            'Vendedor', 
            'Almacen', 
            'Repartidor', 
            'Cliente', 
            'Soporte', 
            'Proveedor'
        ]
    })
    rol: RolUsuario;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    // --- Relaciones ---

    // Un Usuario (Cliente) puede tener muchos Pedidos
    @OneToMany(() => Pedido, (pedido) => pedido.cliente)
    pedidos: Pedido[];

    // --- ¡NUEVAS RELACIONES AÑADIDAS! ---

    // Un Usuario (Repartidor) puede tener muchos Envíos asignados
    @OneToMany(() => Envio, (envio) => envio.repartidor)
    enviosAsignados: Envio[];

    // Un Usuario (Cliente) puede tener muchos items en el carrito
    @OneToMany(() => CarritoItem, (item) => item.cliente)
    carritoItems: CarritoItem[];

    // Un Usuario (Cliente) puede realizar muchas calificaciones
    @OneToMany(() => Calificacion, (calificacion) => calificacion.cliente)
    calificaciones: Calificacion[];

    // Un Usuario (Admin/Almacen) puede registrar muchos movimientos de stock
    @OneToMany(() => MovimientoStock, (movimiento) => movimiento.usuario)
    movimientosStock: MovimientoStock[];
}