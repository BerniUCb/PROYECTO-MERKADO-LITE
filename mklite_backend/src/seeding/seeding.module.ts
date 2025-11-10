
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service'; 


import { User } from '../entity/user.entity'; 
import { Categoria } from '../entity/category.entity';
import { Producto } from '../entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Categoria, Producto]),
  ],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}