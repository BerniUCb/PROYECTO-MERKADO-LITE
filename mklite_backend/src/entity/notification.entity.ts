// src/entity/notification.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

// Tipos de notificación específicos para el negocio
export type TipoNotificacion = 
  | 'CIERRE_CAJA'           // Para Administradores
  | 'STOCK_BAJO'            // Para Administradores
  | 'DEMANDA_ALTA_PRODUCTO' // Para Administradores
  | 'PEDIDO_RECIBIDO'       // Para Clientes
  | 'PEDIDO_EN_CAMINO'      // Para Clientes
  | 'PEDIDO_ENTREGADO'      // Para Clientes
  | 'NUEVA_PROMOCION';      // Para Clientes

// Roles de destinatario para filtrado fácil
export type RolDestinatario = 'Administrador' | 'Cliente';

@Entity('notificacion')
export class Notificacion {

    @PrimaryGeneratedColumn({ name: 'notificacion_id' })
    id: number;

    @Column()
    titulo: string; // Ej: "Cierre de Caja del 17/11/2025"

    @Column({ type: 'text' })
    detalle: string; // Ej: "Se ha generado el reporte de cierre de caja para el vendedor X."

    @Column({
        type: 'enum',
        enum: [
            'CIERRE_CAJA',
            'STOCK_BAJO',
            'DEMANDA_ALTA_PRODUCTO',
            'PEDIDO_RECIBIDO',
            'PEDIDO_EN_CAMINO',
            'PEDIDO_ENTREGADO',
            'NUEVA_PROMOCION'
        ]
    })
    tipo: TipoNotificacion;
    
    @Column({
        type: 'enum',
        enum: ['Administrador', 'Cliente'],
        name: 'destinatario_rol'
    })
    destinatarioRol: RolDestinatario;

    @Column({ name: 'entidad_relacionada_id', nullable: true })
    entidadRelacionadaId: string; // Ej: puede guardar un 'pedido_id' o 'producto_id'

    @Column({ default: false })
    leido: boolean;

    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;

    // --- Relaciones ---
    // Muchas notificaciones pertenecen a un solo usuario (el destinatario)
    @ManyToOne(() => User, (usuario) => usuario.notificaciones, { nullable: true }) // Nullable para notificaciones globales
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;
}