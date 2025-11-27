import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierReturn } from '../entity/supplier-return.entity';
import { SupplierReturnController } from './supplier-return.controller';
import { SupplierReturnService } from './supplier-return.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierReturn])],
  controllers: [SupplierReturnController],
  providers: [SupplierReturnService],
})
export class SupplierReturnModule {}