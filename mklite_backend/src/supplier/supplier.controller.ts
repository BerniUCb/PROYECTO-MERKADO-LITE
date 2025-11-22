import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Supplier } from 'src/entity/supplier.entity';
import { SupplierService } from './supplier.service';

@Controller('/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  createSupplier(@Body() supplier: Supplier) {
    return this.supplierService.createSupplier(supplier);
  }

  @Get()
  getAllSuppliers() {
    return this.supplierService.getAllSuppliers();
  }

  @Get('/:id')
  getSupplierById(@Param('id') id: string) {
    return this.supplierService.getSupplierById(id);
  }

  @Delete('/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(id);
  }

  @Put('/:id')
  updateSupplier(@Param('id') id: string, @Body() supplier: Supplier) {
    return this.supplierService.updateSupplier(id, supplier);
  }
}
