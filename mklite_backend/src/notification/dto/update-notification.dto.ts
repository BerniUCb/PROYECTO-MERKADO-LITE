// src/notification/dto/update-notification.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) 
{
    // No es necesario redefinir los campos aquí a menos que queramos cambiar su validación.
}