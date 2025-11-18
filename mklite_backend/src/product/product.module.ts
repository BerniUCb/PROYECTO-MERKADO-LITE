import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Producto } from '../entity/product.entity';    
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]) 
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}


