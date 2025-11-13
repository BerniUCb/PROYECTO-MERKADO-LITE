import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';


import { CategoryModule } from './category/category.module';  // De la rama de Mateo

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    

    CategoryModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}