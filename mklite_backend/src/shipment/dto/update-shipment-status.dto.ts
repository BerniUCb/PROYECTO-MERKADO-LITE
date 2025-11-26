// src/shipment/dto/update-shipment-status.dto.ts

import { IsEnum } from 'class-validator';
import { ShipmentStatus } from '../../entity/shipment.entity';

export class UpdateShipmentStatusDto {
    @IsEnum([
        'pending', 
        'processing', 
        'shipped', 
        'delivered', 
        'returned',
        'cancelled'
    ])
    status: ShipmentStatus;
}