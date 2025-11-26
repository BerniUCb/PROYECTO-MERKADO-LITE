// src/shipment/dto/create-shipment.dto.ts

import { IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ShipmentStatus } from '../../entity/shipment.entity';

export class CreateShipmentDto {
  
  // Relaciones (ID del objeto relacionado)
  @IsNumber()
  orderId: number; 

  @IsNumber()
  deliveryAddressId: number; 
  
  // Opcionales para la creación inicial

  @IsOptional()
  @IsNumber()
  deliveryDriverId?: number; 
  
  @IsOptional()
  @IsDateString()
  estimatedDeliveryAt?: Date;
  
  @IsOptional()
  @IsEnum([
    'pending', 
    'processing', 
    'shipped', 
    'delivered', 
    'returned',
    'cancelled'
  ])
  status?: ShipmentStatus;
}