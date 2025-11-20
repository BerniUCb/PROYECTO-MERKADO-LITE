import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from '../entity/cart-item.entity';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, User, Product])],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
