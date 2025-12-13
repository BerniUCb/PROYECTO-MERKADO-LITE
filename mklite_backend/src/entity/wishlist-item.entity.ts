import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity('wishlist_items')
@Unique(['user', 'product']) // evita duplicados de productos en la lista de deseos de un usuario
export class WishlistItem {

    @PrimaryGeneratedColumn({ name: 'wishlist_item_id' })
    id: number;

    @CreateDateColumn({ name: 'added_at' })
    addedAt: Date;

    // Relación: Muchos items de deseo pertenecen a un Usuario
    @ManyToOne(() => User, (user) => user.wishlistItems, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relación: Muchos items de deseo apuntan a un Producto
    @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;
}