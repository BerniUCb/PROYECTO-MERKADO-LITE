import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { UserModule } from './user/user.module';
// Los imports de SeedingModule y SeedingService han sido eliminados.

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    // SeedingModule ha sido eliminado de la lista de imports.
  ],
  controllers: [AppController],
  providers: [AppService],
})
// La clase ya no implementa OnApplicationBootstrap.
export class AppModule {}