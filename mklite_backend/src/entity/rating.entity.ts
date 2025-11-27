// src/entity/rating.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, Check } from "typeorm";
import { Order } from "./order.entity"; 
import { User } from "./user.entity";

@Entity('ratings') 
@Check(`"score" >= 1 AND "score" <= 5`) 
export class Rating { 

    @PrimaryGeneratedColumn({ name: 'rating_id' }) 
    id: number;
    
    @Column({ type: 'integer' })
    score: number; 

    @Column({ type: 'text', nullable: true })
    comment: string; 

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; 
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) 
    order: Order; 

    @ManyToOne(() => User, (user) => user.ratings, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User; 
}