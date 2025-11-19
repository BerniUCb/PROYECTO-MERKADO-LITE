import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Promocion } from '../entity/promotion.entity';    
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Promocion]) 
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}