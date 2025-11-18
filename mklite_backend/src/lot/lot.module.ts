// src/lote/lot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lote } from '../entity/lot.entity';
import { LotService } from './lot.service';
import { LotController } from './lot.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lote]) // 1. Registramos la entidad Lote
  ],
  controllers: [LotController], // 2. Añadimos el controlador
  providers: [LotService], // 3. Añadimos el servicio
})
export class LotModule {}