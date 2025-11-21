import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity'; // <-- ¡IMPORTANTE!

@Module({
  imports: [TypeOrmModule.forFeature([Address])], // <-- aniadido !
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}