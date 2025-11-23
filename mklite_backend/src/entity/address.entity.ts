// src/entity/address.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('addresses') // <-- Nombre de la tabla en plural
export class Address { // <-- Nombre de la clase en inglés

    @PrimaryGeneratedColumn({ name: 'address_id' }) // <-- Columna ID
    id: number;

    @Column()
    street: string; // <-- calle

    @Column({ name: 'street_number' }) // <-- numero_exterior
    streetNumber: string;

    @Column({ name: 'internal_number', nullable: true }) // <-- numero_interior
    internalNumber: string;

    @Column({ name: 'postal_code' }) // <-- codigo_postal
    postalCode: string;

    @Column()
    city: string; // <-- ciudad

    @Column()
    state: string; // <-- estado

    @Column({ nullable: true })
    references: string; // <-- referencias

    @Column({ name: 'address_alias', default: 'Home' }) // <-- alias_direccion
    addressAlias: string;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    // --- Relationships ---
    @ManyToOne(() => User, (user) => user.addresses, { nullable: false }) // <-- 'user.addresses'
    @JoinColumn({ name: 'user_id' }) // <-- 'user_id'
    user: User; // <-- 'usuario'
}