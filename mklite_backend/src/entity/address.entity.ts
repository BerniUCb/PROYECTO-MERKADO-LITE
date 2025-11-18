// src/entity/address.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('direccion')
export class Direccion {

    @PrimaryGeneratedColumn({ name: 'direccion_id' })
    id: number;

    @Column()
    calle: string;

    @Column({ name: 'numero_exterior' })
    numeroExterior: string;

    @Column({ name: 'numero_interior', nullable: true })
    numeroInterior: string;

    @Column({ name: 'codigo_postal' })
    codigoPostal: string;

    @Column()
    ciudad: string;

    @Column()
    estado: string;

    @Column({ nullable: true })
    referencias: string;

    @Column({ name: 'alias_direccion', default: 'Casa' }) // Ej: "Casa", "Oficina", "Casa de mis padres tipo pedidos ya "
    aliasDireccion: string;

    @Column({ name: 'is_default', default: false }) // Para saber cual es la dirección principal
    isDefault: boolean;

    // --- Relaciones ---
    @ManyToOne(() => User, (usuario) => usuario.direcciones, { nullable: false })
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;
}