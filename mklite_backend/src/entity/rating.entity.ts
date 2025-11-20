// src/entity/rating.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, Check } from "typeorm";
import { Order } from "./order.entity"; // <-- Actualizado a 'Order'
import { User } from "./user.entity";

@Entity('ratings') // <-- 'calificacion' -> 'ratings'
@Check(`"score" >= 1 AND "score" <= 5`) // <-- ¡IMPORTANTE! Actualizado de "puntuacion" a "score"
export class Rating { // <-- 'Calificacion' -> 'Rating'

    @PrimaryGeneratedColumn({ name: 'rating_id' }) // <-- 'calificacion_id'
    id: number;
    
    @Column({ type: 'integer' })
    score: number; // <-- 'puntuacion' -> 'score'

    @Column({ type: 'text', nullable: true })
    comment: string; // <-- 'comentario' -> 'comment'

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date; // <-- 'fechaCalificacion' -> 'createdAt'

    // --- Relationships ---
    @OneToOne(() => Order, { nullable: false })
    @JoinColumn({ name: 'order_id' }) // <-- 'pedido_id'
    order: Order; // <-- 'pedido' -> 'order'

    @ManyToOne(() => User, (user) => user.ratings, { nullable: false }) // <-- Relación inversa será 'user.ratings'
    @JoinColumn({ name: 'user_id' }) // <-- 'cliente_id' -> 'user_id'
    user: User; // <-- 'cliente' -> 'user'
}