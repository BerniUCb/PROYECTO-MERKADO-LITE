import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion} from '../entity/promotion.entity';

@Injectable()
export class PromotionService {

  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async createPromotion(promotion: Promotion): Promise<Promotion> {

    const newPromotion = this.promotionRepository.create(promotion); 
    return await this.promotionRepository.save(newPromotion);
  }

  async getAllPromotions(): Promise<Promotion[]> {
    
    return await this.promotionRepository.find({relations: ['product'],});
  }

  async getPromotionById(id: number): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOne({ where: { id }, relations: ['product'],});
    

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
    return promotion;
  }

  async deletePromotion(id: number): Promise<{ deleted: boolean; affected?: number }> {
    const result = await this.promotionRepository.delete({ id }); 
    if (result.affected === 0) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updatePromotion(id: number, promotionUpdateData: Partial<Promotion>): Promise<Promotion> {
    
    const promotionToUpdate = await this.promotionRepository.preload({
      id: id,
      ...promotionUpdateData,
    });

    if (!promotionToUpdate) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    return await this.promotionRepository.save(promotionToUpdate);
  }
}