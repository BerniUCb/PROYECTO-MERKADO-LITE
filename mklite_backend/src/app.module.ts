import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';  // De la rama de Mateo
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
import { Product } from 'src/entity/product.entity';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';


import { TicketModule } from './support-ticket/support-ticket.module';

import { AddressModule } from './address/address.module';
import { stockMovementModule } from './stock-movement/stock-movement.module';
import { CheckoutModule } from './checkout/checkout.module';


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
    AddressModule,
    stockMovementModule,
    CheckoutModule,
   

  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}