// src/shipment/shipment.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { Shipment } from '../entity/shipment.entity';
// Asegúrate de importar las otras entidades si necesitas inyectar sus repositorios
import { User } from '../entity/user.entity'; 
import { Order } from '../entity/order.entity'; 
import { Address } from '../entity/address.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, User, Order, Address])],
  controllers: [ShipmentController],
  providers: [ShipmentService],
  exports: [ShipmentService],
})
export class ShipmentModule {}