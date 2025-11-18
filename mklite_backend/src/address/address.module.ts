import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direccion } from '../entity/address.entity'; // <-- ¡IMPORTANTE!

@Module({
  imports: [TypeOrmModule.forFeature([Direccion])], // <-- aniadido !
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}