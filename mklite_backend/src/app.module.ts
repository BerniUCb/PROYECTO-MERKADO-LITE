import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';  // De la rama de Mateo
import { ProductModule } from './product/product.module';
import { PromotionModule } from './promotion/promotion.module';
<<<<<<< HEAD
import { TicketModule } from './support-ticket/support-ticket.module';
=======
import { AddressModule } from './address/address.module';
>>>>>>> 3ad57b5a67ec0118e1fc33113fffd58da8009248
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    CategoryModule,
    ProductModule,
    PromotionModule,
<<<<<<< HEAD
    TicketModule,
=======
    AddressModule,
>>>>>>> 3ad57b5a67ec0118e1fc33113fffd58da8009248
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}