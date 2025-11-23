import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entity/payment.entity';
import { Order } from 'src/entity/order.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
