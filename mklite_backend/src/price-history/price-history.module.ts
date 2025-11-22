import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceHistory } from 'src/entity/price-history.entity';
import { Product } from 'src/entity/product.entity';
import { User } from 'src/entity/user.entity';
import { PriceHistoryService } from './price-history.service';
import { PriceHistoryController } from './price-history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceHistory, Product, User])
  ],
  controllers: [PriceHistoryController],
  providers: [PriceHistoryService],
})
export class PriceHistoryModule {}
