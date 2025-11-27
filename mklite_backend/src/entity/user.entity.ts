// src/entity/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./order.entity";
import { Shipment } from "./shipment.entity";
import { CartItem } from "./cart-item.entity";
import { Rating } from "./rating.entity";
import { StockMovement } from "./stock-movement.entity";
import { Address } from "./address.entity";
import { Notification } from "./notification.entity";


export type UserRole = 'Admin' | 'Seller' | 'Warehouse' | 'DeliveryDriver' | 'Client' | 'Support' | 'Supplier';

@Entity('users') 
export class User {

    @PrimaryGeneratedColumn({ name: 'user_id' }) 
    id: number;

    @Column({ name: 'full_name' })
    fullName: string; 

    @Column({ unique: true })
    email: string;
    @Column({ nullable: true, unique: true }) 
    phone: string;
    
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
    role: UserRole; 

    @Column({ name: 'is_active', default: true })
    isActive: boolean;
    @Column({ name: 'is_two_factor_enabled', default: false })
    isTwoFactorEnabled: boolean;

    @Column({ name: 'two_factor_secret', nullable: true, select: false }) 
    twoFactorSecret: string;
 
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