import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoItem } from '../entity/cart-item.entity';
import { User } from '../entity/user.entity';
import { Producto } from '../entity/product.entity';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoItem, User, Producto])],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
