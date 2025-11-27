import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierReturn } from '../entity/supplier-return.entity';

@Injectable()
export class SupplierReturnService {
  constructor(
    @InjectRepository(SupplierReturn)
    private readonly supplierReturnRepository: Repository<SupplierReturn>,
  ) {}

  async createSupplierReturn(supplierReturn : SupplierReturn): Promise<SupplierReturn> {
    return this.supplierReturnRepository.save(supplierReturn);
  }

  async getAllSupplierReturns(): Promise<SupplierReturn[]> {
    return this.supplierReturnRepository.find();
  }

  async getSupplierReturnById(id: number): Promise<SupplierReturn> {
    const supplierReturn = await this.supplierReturnRepository.findOne({ where: { id } });
    if (!supplierReturn) {
      throw new NotFoundException(`Supplier Return with ID ${id} not found`);
    }
    return supplierReturn;
  }

  async deleteSupplierReturn(id: string): Promise<void> {
    const result = await this.supplierReturnRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier Return with ID ${id} not found`);
    }
  }

  async updateSupplierReturn(id: string, supplierReturn: SupplierReturn): Promise<SupplierReturn> {
    const existingSupplierReturn = await this.getSupplierReturnById( { where : { id } } as any);
    const updatedSupplierReturn = Object.assign(existingSupplierReturn, supplierReturn);
    return this.supplierReturnRepository.save(updatedSupplierReturn);
  }
}
