import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { NotificationType, RecipientRole } from '../../entity/notification.entity';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  
  @IsString()
  title: string;

  @IsString()
  detail: string;

  @IsEnum([
    'CASH_REGISTER_CLOSED',
    'LOW_STOCK',
    'HIGH_DEMAND_PRODUCT',
    'ORDER_RECEIVED',
    'ORDER_SHIPPED',
    'ORDER_DELIVERED',
    'NEW_PROMOTION'
  ], { message: 'Type must be a valid NotificationType enum value.' })
  type: NotificationType;

  @IsEnum(['Admin', 'Client'], { message: 'RecipientRole must be "Admin" or "Client".' })
  recipientRole: RecipientRole;

  @IsOptional()
  @IsString()
  relatedEntityId?: string;

  // Para asociar la notificación a un usuario específico
  @IsOptional()
  @IsNumber()
  // Importante: Usamos @Type para asegurar que el valor entrante (que podría ser un string de la request) se convierta a número.
  @Type(() => Number) 
  userId?: number; 

  // Aunque por defecto es 'false' en la entidad, se puede enviar explícitamente en la creación si es necesario
  @IsOptional()
  @IsBoolean()
  isRead?: boolean; 
}