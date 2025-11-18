import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketSoporte } from '../entity/support-ticket.entity';
import { Pedido } from '../entity/order.entity';
import { User } from '../entity/user.entity';
import { MensajeSoporte } from '../entity/support-message.entity';
import { TicketService } from './support-ticket.service';
import { TicketController } from './support-ticket.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketSoporte, Pedido, User, MensajeSoporte]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
