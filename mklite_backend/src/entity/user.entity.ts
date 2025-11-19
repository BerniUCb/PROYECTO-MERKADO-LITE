// src/entity/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./order.entity";
import { Shipment } from "./shipment.entity";
import { CartItem } from "./cart-item.entity";
import { Rating } from "./rating.entity";
import { StockMovement } from "./stock-movement.entity";
import { Address } from "./address.entity";
import { Notification } from "./notification.entity";

// Define the user roles in English
export type UserRole = 'Admin' | 'Seller' | 'Warehouse' | 'DeliveryDriver' | 'Client' | 'Support' | 'Supplier';

@Entity('users') // <-- 'usuario' -> 'users'
export class User {

    @PrimaryGeneratedColumn({ name: 'user_id' }) // <-- 'usuario_id'
    id: number;

    @Column({ name: 'full_name' })
    fullName: string; // <-- 'nombreCompleto' -> 'fullName'

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash', select: false })
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: [ 
            'Admin', 
            'Seller', 
            'Warehouse', 
            'DeliveryDriver', 
            'Client', 
            'Support', 
            'Supplier'
        ]
    })
    role: UserRole; // <-- 'rol' -> 'role'

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
        // --- NUEVOS CAMPOS PARA 2FA (HU21) ---
    @Column({ name: 'is_two_factor_enabled', default: false })
    isTwoFactorEnabled: boolean;

    @Column({ name: 'two_factor_secret', nullable: true, select: false }) // Select false por seguridad
    twoFactorSecret: string;
 
    // --- Relationships ---
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Shipment, (shipment) => shipment.deliveryDriver)
    assignedShipments: Shipment[];

    @OneToMany(() => CartItem, (item) => item.user)
    cartItems: CartItem[];

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings: Rating[];

    @OneToMany(() => StockMovement, (movement) => movement.user)
    stockMovements: StockMovement[];

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
}