import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Buscar item por usuario + producto
  async findByUserAndProduct(userId: number, productId: number): Promise<CartItem | null> {
    return await this.cartItemRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });
  }

  // AGREGAR AL CARRITO
  async addToCart(userId: number, productId: number, quantity = 1): Promise<CartItem> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const unitPrice = Number(product.salePrice);
    if (isNaN(unitPrice)) {
      throw new Error(`Product ${productId} has invalid salePrice`);
    }

    // Si ya existe, sumar quantity (NO tocar unitPrice)
    const existing = await this.findByUserAndProduct(userId, productId);
    if (existing) {
      existing.quantity += quantity;
      return await this.cartItemRepository.save(existing);
    }

    // Crear nuevo item con unitPrice obligatorio
    const newItem = this.cartItemRepository.create({
      user,
      product,
      quantity,
      unitPrice,   // <--------- FIX IMPORTANTE
    });

    return await this.cartItemRepository.save(newItem);
  }

  // OBTENER CARRITO POR USUARIO
  async getCartByUser(userId: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'user'],
    });
  }

  // UPDATE cantidad por id
  async updateQuantityById(id: number, quantity: number): Promise<CartItem> {
    const existing = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!existing) throw new NotFoundException('Cart item not found');

    existing.quantity = quantity;
    return await this.cartItemRepository.save(existing);
  }

  // UPDATE cantidad por user + product
  async updateQuantityByUserProduct(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const existing = await this.findByUserAndProduct(userId, productId);

    if (!existing) throw new NotFoundException('Cart item not found');

    existing.quantity = quantity;
    return await this.cartItemRepository.save(existing);
  }

  // DELETE item por user + product
  async removeItemByUserProduct(userId: number, productId: number): Promise<{ deleted: boolean }> {
    const existing = await this.findByUserAndProduct(userId, productId);

    if (!existing) throw new NotFoundException('Cart item not found');

    await this.cartItemRepository.remove(existing);
    return { deleted: true };
  }

  // Métodos por ID (compatibilidad antigua)
  async createCartItem(cartItem: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(this.cartItemRepository.create(cartItem));
  }

  async getAllCartItems(): Promise<CartItem[]> {
    return await this.cartItemRepository.find({ relations: ['product', 'user'] });
  }

  async getcartItemById(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!cartItem) throw new NotFoundException(`cart-item with ID "${id}" not found`);
    return cartItem;
  }

  async deleteCartItem(id: number): Promise<{ deleted: boolean }> {
    const result = await this.cartItemRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`cart-item with ID "${id}" not found`);
    }

    return { deleted: true };
  }
}
