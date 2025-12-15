import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from '../entity/wishlist-item.entity';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';
import { WishlistService } from './wish-list.service';
import { WishlistController } from './wish-list.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistItem, User, Product]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
