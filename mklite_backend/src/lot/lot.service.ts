// src/Lot/lot.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entity/lot.entity';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(Lot)
    private readonly LotRepository: Repository<Lot>,
  ) {}

  async createLot(Lot: Lot): Promise<Lot> {
    const newLot = this.LotRepository.create(Lot);
    return await this.LotRepository.save(newLot);
  }

  async getAllLots(): Promise<Lot[]> {
    return await this.LotRepository.find({
      relations: ['producto', 'proveedor'],
    });
  }

  async getLotById(idString: string): Promise<Lot> {
    const id = parseInt(idString, 10);
    const Lot = await this.LotRepository.findOne({
      where: { id },
      relations: ['producto', 'proveedor']
    });

    if (!Lot) {
      throw new NotFoundException(`Lot with ID "${id}" not found`);
    }
    return Lot;
  }

  async deleteLot(idString: string): Promise<{ deleted: boolean; affected?: number }> {
    const id = parseInt(idString, 10);
    const result = await this.LotRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Lot with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateLot(idString: string, LotUpdateData: Partial<Lot>): Promise<Lot> {
    const id = parseInt(idString, 10);
    
    const LotToUpdate = await this.LotRepository.preload({
      id: id,
      ...LotUpdateData,
    });

    if (!LotToUpdate) {
      throw new NotFoundException(`Lot with ID "${id}" not found`);
    }

    return await this.LotRepository.save(LotToUpdate);
  }
}