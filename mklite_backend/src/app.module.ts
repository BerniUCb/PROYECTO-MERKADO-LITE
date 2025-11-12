import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source'; // Importamos las OPCIONES

import { SeedingModule } from './seeding/seeding.module';
import { CategoryModule } from './category/category.module';
import { SeedingService } from './seeding/seeding.service';

@Module({
  imports: [
    // Aquí le pasamos el objeto de configuración. ¡Esto es correcto!
    TypeOrmModule.forRoot(dataSourceOptions),
    SeedingModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}

  async onApplicationBootstrap() {
    await this.seedingService.seed();
  }
}