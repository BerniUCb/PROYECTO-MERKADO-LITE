import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from 'src/entity/rating.entity';
import { Order } from 'src/entity/order.entity';
import { User } from 'src/entity/user.entity';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Rating, Order, User])],
    controllers: [RatingController],
    providers: [RatingService],
    exports: [RatingService],
})
export class RatingModule{}