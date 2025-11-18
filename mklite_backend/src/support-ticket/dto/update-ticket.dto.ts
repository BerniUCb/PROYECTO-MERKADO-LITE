import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  estado?: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
}