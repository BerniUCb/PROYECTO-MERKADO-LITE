import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PriceHistory } from 'src/entity/price-history.entity';
import { Product } from 'src/entity/product.entity';
import { User } from 'src/entity/user.entity';

import { CreatePriceHistoryDto } from './dto/create-price-history.dto';
import { UpdatePriceHistoryDto } from './dto/update-price-history.dto';

@Injectable()
export class PriceHistoryService {

  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  
  async create(dto: CreatePriceHistoryDto): Promise<PriceHistory> {
    const product = await this.productRepository.findOneBy({ id: dto.product_id });
    if (!product) {
      throw new NotFoundException(`Product ID ${dto.product_id} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: dto.user_id });
    if (!user) {
      throw new NotFoundException(`User ID ${dto.user_id} not found`);
    }

    const newPriceHistory = this.priceHistoryRepository.create({
      newPrice: dto.newPrice,
      product,
      changedByUser: user
    });

    return await this.priceHistoryRepository.save(newPriceHistory);
  }


  async findAll(): Promise<PriceHistory[]> {
    return await this.priceHistoryRepository.find({
      relations: ['product', 'changedByUser'],
    });
  }

  
  async findOne(id: number): Promise<PriceHistory> {
    const priceHistory = await this.priceHistoryRepository.findOne({
      where: { id },
      relations: ['product', 'changedByUser'],
    });

    if (!priceHistory) {
      throw new NotFoundException(`Price History ID ${id} not found`);
    }

    return priceHistory;
  }


  async findByProduct(productId: number): Promise<PriceHistory[]> {
    return await this.priceHistoryRepository.find({
      where: { product: { id: productId } },
      relations: ['product', 'changedByUser'],
      order: { changedAt: 'DESC' }
    });
  }

  
  async delete(id: number): Promise<{ deleted: boolean }> {
    const result = await this.priceHistoryRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Price History ID ${id} not found`);
    }
    return { deleted: true };
  }
}
