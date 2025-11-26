import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';  // De la rama de Mateo
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';

import { NotificationModule } from './notification/notification.module';
import { TicketModule } from './support-ticket/support-ticket.module';
import { AddressModule } from './address/address.module';
import { stockMovementModule } from './stock-movement/stock-movement.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ConfigModule } from '@nestjs/config';
import { BackupController } from './backup/backup.controller';
import { ShipmentModule } from './shipment/shipment.module';

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
    ShipmentModule,
    AddressModule,
    stockMovementModule,
    CheckoutModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }), // Carga .env automáticamente
    UserModule,
   

  ],
  controllers: [AppController, BackupController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}