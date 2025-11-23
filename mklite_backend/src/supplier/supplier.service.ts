import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entity/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async createSupplier(data: Supplier): Promise<Supplier> {
    const nuevoSupplier = this.supplierRepository.create(data);
    return await this.supplierRepository.save(nuevoSupplier);
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async getSupplierById(id: string): Promise<Supplier> {
    const supplierId = parseInt(id, 10);
    const supplier = await this.supplierRepository.findOneBy({ id: supplierId });

    if (!supplier) {
      throw new NotFoundException(`Supplier con ID "${supplierId}" no encontrado`);
    }
    return supplier;
  }

  async deleteSupplier(id: string): Promise<{ deleted: boolean; affected?: number }> {
    const supplierId = parseInt(id, 10);
    const result = await this.supplierRepository.delete({ id: supplierId });

    if (result.affected === 0) {
      throw new NotFoundException(`Supplier con ID "${supplierId}" no encontrado`);
    }
    return { deleted: true, affected: result.affected ?? 0 };
  }

  async updateSupplier(id: string, updateData: Partial<Supplier>): Promise<Supplier> {
    const supplierId = parseInt(id, 10);
    const supplierToUpdate = await this.supplierRepository.preload({
      id: supplierId,
      ...updateData,
    });

    if (!supplierToUpdate) {
      throw new NotFoundException(`Supplier con ID "${supplierId}" no encontrado`);
    }

    return await this.supplierRepository.save(supplierToUpdate);
  }
}
