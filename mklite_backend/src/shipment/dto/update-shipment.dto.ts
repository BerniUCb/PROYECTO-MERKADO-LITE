// src/shipment/dto/update-shipment.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentDto } from './create-shipment.dto';

// Permite actualizar cualquier campo, haciéndolos opcionales
export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {}