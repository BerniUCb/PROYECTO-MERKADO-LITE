// src/lote/lot.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../entity/lot.entity';

@Injectable()
export class LotService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async createLote(lote: Lote): Promise<Lote> {
    const newLote = this.loteRepository.create(lote);
    return await this.loteRepository.save(newLote);
  }

  async getAllLotes(): Promise<Lote[]> {
    return await this.loteRepository.find({
      relations: ['producto', 'proveedor'],
    });
  }

  async getLoteById(idString: string): Promise<Lote> {
    const id = parseInt(idString, 10);
    const lote = await this.loteRepository.findOne({
      where: { id },
      relations: ['producto', 'proveedor']
    });

    if (!lote) {
      throw new NotFoundException(`Lote with ID "${id}" not found`);
    }
    return lote;
  }

  async deleteLote(idString: string): Promise<{ deleted: boolean; affected?: number }> {
    const id = parseInt(idString, 10);
    const result = await this.loteRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Lote with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateLote(idString: string, loteUpdateData: Partial<Lote>): Promise<Lote> {
    const id = parseInt(idString, 10);
    
    const loteToUpdate = await this.loteRepository.preload({
      id: id,
      ...loteUpdateData,
    });

    if (!loteToUpdate) {
      throw new NotFoundException(`Lote with ID "${id}" not found`);
    }

    return await this.loteRepository.save(loteToUpdate);
  }
}