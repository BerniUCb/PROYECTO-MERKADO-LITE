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


import { TicketModule } from './support-ticket/support-ticket.module';

import { AddressModule } from './address/address.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    CategoryModule,
    ProductModule,
    PromotionModule,

    OrderModule,


    TicketModule,

    AddressModule,

   

  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}