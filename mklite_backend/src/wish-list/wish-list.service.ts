import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from '../entity/wishlist-item.entity';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepository: Repository<WishlistItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getByUser(userId: number): Promise<WishlistItem[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { addedAt: 'DESC' },
    });
  }

  async getByUserAndProduct(userId: number, productId: number): Promise<WishlistItem> {
    const item = await this.wishlistRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }

    return item;
  }

  async add(userId: number, productId: number): Promise<WishlistItem> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const existing = await this.wishlistRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = this.wishlistRepository.create({ user, product });
    return this.wishlistRepository.save(item);
  }

  async removeById(id: number): Promise<void> {
    const result = await this.wishlistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }
  }

  async removeByUserAndProduct(userId: number, productId: number): Promise<void> {
    const result = await this.wishlistRepository.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }
  }
}
