// src/entity/address.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('addresses') 
export class Address { 

    @PrimaryGeneratedColumn({ name: 'address_id' }) 
    id: number;

    @Column()
    street: string; 

    @Column({ name: 'street_number' }) 
    streetNumber: string;

    @Column({ name: 'internal_number', nullable: true }) r
    internalNumber: string;

    @Column({ name: 'postal_code' }) 
    postalCode: string;

    @Column()
    city: string; 

    @Column()
    state: string;

    @Column({ nullable: true })
    references: string; 

    @Column({ name: 'address_alias', default: 'Home' }) 
    addressAlias: string;

    @Column({ name: 'is_default', default: false })
    isDefault: boolean;

    @ManyToOne(() => User, (user) => user.addresses, { nullable: false }) 
    @JoinColumn({ name: 'user_id' }) 
    user: User; 
}