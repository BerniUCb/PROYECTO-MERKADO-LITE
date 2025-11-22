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

  // helper: buscar por user+product
  async findByUserAndProduct(userId: number, productId: number): Promise<CartItem | null> {
    return await this.cartItemRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });
  }

  // añadir al carrito (si existe -> sumar quantity)
  async addToCart(userId: number, productId: number, quantity = 1): Promise<CartItem> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const existing = await this.findByUserAndProduct(userId, productId);
    if (existing) {
      existing.quantity += quantity;
      return await this.cartItemRepository.save(existing);
    }

    const newItem = this.cartItemRepository.create({
      user: user,
      product: product,
      quantity,
    });

    return await this.cartItemRepository.save(newItem);
  }

  // listar carrito por usuario
  async getCartByUser(userId: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: ['product','user'],
    });
  }

  // update por id (mantén si usas id)
  async updateQuantityById(id: number, quantity: number): Promise<CartItem> {
    const existing = await this.cartItemRepository.findOne({ where: { id }, relations: ['Product','cliente'] });
    if (!existing) throw new NotFoundException('Cart item not found');
    existing.quantity = quantity;
    return await this.cartItemRepository.save(existing);
  }

  // update por user+product
  async updateQuantityByUserProduct(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const existing = await this.findByUserAndProduct(userId, productId);
    if (!existing) throw new NotFoundException('Cart item not found');
    existing.quantity = quantity;
    return await this.cartItemRepository.save(existing);
  }

  // eliminar por user+product
  async removeItemByUserProduct(userId: number, productId: number): Promise<{ deleted: boolean }> {
    const existing = await this.findByUserAndProduct(userId, productId);
    if (!existing) throw new NotFoundException('Cart item not found');
    await this.cartItemRepository.remove(existing);
    return { deleted: true };
  }

  // mantener métodos CRUD por id si los necesitas
  async createCartItem(cartItem: CartItem): Promise<CartItem> {
    return await this.cartItemRepository.save(this.cartItemRepository.create(cartItem));
  }

  async getAllCartItems(): Promise<CartItem[]> {
    return await this.cartItemRepository.find({ relations: ['cliente','Product'] });
  }

  async getcartItemById(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id }, relations: ['cliente','Product']});
    if(!cartItem) throw new NotFoundException(`cart-Item with ID "${id}" not found`);
    return cartItem;
  }

  async deleteCartItem(id: number): Promise<{ deleted: boolean, affected?: number }> {
    const result = await this.cartItemRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException(`cart-Item with ID "${id}" not found`);
    return { deleted: true, affected: result.affected ?? 0 };
  }
}
