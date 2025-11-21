import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from '../entity/supplier.entity';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
