import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entity/provider.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly providerRepository: Repository<Proveedor>,
  ) {}

  async createProvider(data: Proveedor): Promise<Proveedor> {
    const nuevoProveedor = this.providerRepository.create(data);
    return await this.providerRepository.save(nuevoProveedor);
  }

  async getAllProviders(): Promise<Proveedor[]> {
    return await this.providerRepository.find();
  }

  async getProviderById(id: string): Promise<Proveedor> {
    const proveedorId = parseInt(id, 10);
    const proveedor = await this.providerRepository.findOneBy({ id: proveedorId });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID "${proveedorId}" no encontrado`);
    }
    return proveedor;
  }

  async deleteProvider(id: string): Promise<{ deleted: boolean; affected?: number }> {
    const proveedorId = parseInt(id, 10);
    const result = await this.providerRepository.delete({ id: proveedorId });

    if (result.affected === 0) {
      throw new NotFoundException(`Proveedor con ID "${proveedorId}" no encontrado`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateProvider(id: string, updateData: Partial<Proveedor>): Promise<Proveedor> {
    const proveedorId = parseInt(id, 10);
    const proveedorToUpdate = await this.providerRepository.preload({
      id: proveedorId,
      ...updateData,
    });

    if (!proveedorToUpdate) {
      throw new NotFoundException(`Proveedor con ID "${proveedorId}" no encontrado`);
    }

    return await this.providerRepository.save(proveedorToUpdate);
  }
}
