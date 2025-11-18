import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from '../entity/cart-item.entity';
import { User } from '../entity/user.entity';
import { Producto } from '../entity/product.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CarritoItem)
    private readonly cartItemRepository: Repository<CarritoItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  // helper: buscar por user+product
  async findByUserAndProduct(userId: number, productId: number): Promise<CarritoItem | null> {
    return await this.cartItemRepository.findOne({
      where: {
        cliente: { id: userId },
        producto: { id: productId },
      },
      relations: ['cliente', 'producto'],
    });
  }

  // añadir al carrito (si existe -> sumar cantidad)
  async addToCart(userId: number, productId: number, cantidad = 1): Promise<CarritoItem> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    const existing = await this.findByUserAndProduct(userId, productId);
    if (existing) {
      existing.cantidad += cantidad;
      return await this.cartItemRepository.save(existing);
    }

    const newItem = this.cartItemRepository.create({
      cliente: user,
      producto: product,
      cantidad,
    });

    return await this.cartItemRepository.save(newItem);
  }

  // listar carrito por usuario
  async getCartByUser(userId: number): Promise<CarritoItem[]> {
    return await this.cartItemRepository.find({
      where: { cliente: { id: userId } },
      relations: ['producto'],
    });
  }

  // update por id (mantén si usas id)
  async updateQuantityById(id: number, cantidad: number): Promise<CarritoItem> {
    const existing = await this.cartItemRepository.findOne({ where: { id }, relations: ['producto','cliente'] });
    if (!existing) throw new NotFoundException('Cart item not found');
    existing.cantidad = cantidad;
    return await this.cartItemRepository.save(existing);
  }

  // update por user+product
  async updateQuantityByUserProduct(userId: number, productId: number, cantidad: number): Promise<CarritoItem> {
    const existing = await this.findByUserAndProduct(userId, productId);
    if (!existing) throw new NotFoundException('Cart item not found');
    existing.cantidad = cantidad;
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
  async createCartItem(cartItem: CarritoItem): Promise<CarritoItem> {
    return await this.cartItemRepository.save(this.cartItemRepository.create(cartItem));
  }

  async getAllCartItems(): Promise<CarritoItem[]> {
    return await this.cartItemRepository.find({ relations: ['cliente','producto'] });
  }

  async getcartItemById(id: number): Promise<CarritoItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id }, relations: ['cliente','producto']});
    if(!cartItem) throw new NotFoundException(`cart-Item with ID "${id}" not found`);
    return cartItem;
  }

  async deleteCartItem(id: number): Promise<{ deleted: boolean, affected?: number }> {
    const result = await this.cartItemRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException(`cart-Item with ID "${id}" not found`);
    return { deleted: true, affected: result.affected ?? 0 };
  }
}
