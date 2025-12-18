import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entity/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItem } from 'src/entity/order-item.entity';
import { Product } from 'src/entity/product.entity';
import { Shipment } from 'src/entity/shipment.entity';
import { Address } from 'src/entity/address.entity';
import { Payment } from 'src/entity/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Shipment, Address, Payment])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}