// src/shipment/dto/assign-shipment.dto.ts

import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ShipmentStatus } from '../../entity/shipment.entity'; // Asegúrate de que esta ruta sea correcta si es necesario

// Definición local del tipo ShipmentStatus para validación (si no se importa directamente)
// NOTA: Si ShipmentStatus está disponible globalmente, puedes omitir la re-definición/importación compleja.
// Asumiendo que has corregido la importación:

export class AssignShipmentDto {
    @IsNumber()
    driverId: number; 

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