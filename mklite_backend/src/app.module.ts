import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';

import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { TicketModule } from './support-ticket/support-ticket.module';
import { SupportMessageModule } from './support-message/support-message.module'; 
import { AddressModule } from './address/address.module';
import { stockMovementModule } from './stock-movement/stock-movement.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ShipmentModule } from './shipment/shipment.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ConfigModule } from '@nestjs/config';
import { BackupController } from './backup/backup.controller';
import { PaymentModule } from './payment/payment.module';
import { DriverApplicationModule } from './driver-application/driver-application.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { OrderItem } from './entity/order-item.entity';
import { PriceHistoryModule } from './price-history/price-history.module';
import { WishlistModule } from './wish-list/wish-list.module'; 
import { Or } from 'typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),

    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    PromotionModule,
    OrderModule,
    TicketModule,
    SupportMessageModule,
    ShipmentModule,
    AddressModule,
    stockMovementModule,
    CheckoutModule,
    NotificationModule,
    OrderItemModule,
    PaymentModule,
    PriceHistoryModule,
    WishlistModule,
    DriverApplicationModule,
    ConfigModule.forRoot({ isGlobal: true }),

    
    CartItemModule,
  ],
  controllers: [AppController, BackupController],
  providers: [AppService],
})
export class AppModule {}
