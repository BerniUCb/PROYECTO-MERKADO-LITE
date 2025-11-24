// src/checkout/checkout.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

// --- Importamos TODAS las entidades involucradas en la transacción ---
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
import { Product } from '../entity/product.entity';
import { User } from '../entity/user.entity';
import { CartItem } from '../entity/cart-item.entity';
import { Payment } from '../entity/payment.entity';
import { Shipment } from '../entity/shipment.entity';
import { Address } from '../entity/address.entity';
import { StockMovement } from '../entity/stock-movement.entity';
import { Lot } from '../entity/lot.entity'; // Importante para la gestión de stock FIFO/LIFO

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      User,
      CartItem,
      Payment,
      Shipment,
      Address,
      StockMovement,
      Lot,
    ]),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}