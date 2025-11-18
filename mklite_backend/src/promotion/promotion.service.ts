// src/user/user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocion} from '../entity/promotion.entity';

// ¡Ya no importamos AppDataSource directamente!

@Injectable()
export class PromotionService {
  // Inyectamos el Repositorio de User. NestJS y TypeOrmModule se encargan de crearlo
  // y dárnoslo listo para usar.
  constructor(
    @InjectRepository(Promocion)
    private readonly promotionRepository: Repository<Promocion>,
  ) {}

  async createPromotion(promotion: Promocion): Promise<Promocion> {
    // Usamos el repositorio para guardar la nueva entidad de producto.
    const newPromotion = this.promotionRepository.create(promotion); // 'create' prepara el objeto para guardarlo
    return await this.promotionRepository.save(newPromotion);
  }

  async getAllPromotions(): Promise<Promocion[]> {
    // Usamos el repositorio para encontrar todos los productos.
    return await this.promotionRepository.find();
  }

  async getPromotionById(id: number): Promise<Promocion> {
    const promotion = await this.promotionRepository.findOneBy({ id });
     // Buscamos por la propiedad 'id'

    // Es una buena práctica verificar si el producto fue encontrado.
    if (!promotion) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
    return promotion;
  }

  async deletePromotion(id: number): Promise<{ deleted: boolean; affected?: number }> {
    const result = await this.promotionRepository.delete({ id }); // Borramos por la propiedad 'id'
    if (result.affected === 0) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updatePromotion(id: number, promotionUpdateData: Partial<Promocion>): Promise<Promocion> {
    
    // Usamos 'preload' para cargar el usuario existente y fusionar los nuevos datos.
    const promotionToUpdate = await this.promotionRepository.preload({
      id: id,
      ...promotionUpdateData,
    });

    if (!promotionToUpdate) {
      throw new NotFoundException(`Promotion with ID "${id}" not found`);
    }

    // Guardamos la entidad actualizada.
    return await this.promotionRepository.save(promotionToUpdate);
  }
}