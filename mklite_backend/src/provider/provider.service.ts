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

  async getProviderById(id: number): Promise<Proveedor> {

    const proveedor = await this.providerRepository.findOneBy({ id: id });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID "${id}" no encontrado`);
    }
    return proveedor;
  }

  async deleteProvider(id: number): Promise<{ deleted: boolean; affected?: number }> {
    const result = await this.providerRepository.delete({ id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Proveedor con ID "${id}" no encontrado`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateProvider(id: number, updateData: Partial<Proveedor>): Promise<Proveedor> {
    const proveedorToUpdate = await this.providerRepository.preload({
      id: id,...updateData,
    });

    if (!proveedorToUpdate) {
      throw new NotFoundException(`Proveedor con ID "${id}" no encontrado`);
    }

    return await this.providerRepository.save(proveedorToUpdate);
  }
}
