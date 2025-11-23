import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { OrderItem } from '../entity/order-item.entity';    
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { Order } from 'src/entity/order.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order]) 
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}


