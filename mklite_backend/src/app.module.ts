import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';

import { ProductModule } from './product/product.module'; // Del merge de Luis
import { OrderModule } from './order/order.module';     // Del merge de Amira
import { CategoryModule } from './category/category.module';  // De la rama de Mateo

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
        // --- ¡AÑADIR ESTOS MÓDULOS A LA LISTA! ---
    ProductModule,
    OrderModule,
    CategoryModule,
    // SeedingModule ha sido eliminado de la lista de imports.
  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}